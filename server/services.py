from itsdangerous import URLSafeTimedSerializer, BadSignature
import yagmail
from email_validator import validate_email, EmailSyntaxError

from .app import App
from .model import ConfirmEmail, ResetPassword


class MailerService(object):
    def __init__(self, username, password, host, port,
                 starttls, smtp_skip_login, token_service):
        self.smtp = yagmail.SMTP(
            username, password, host, port,
            smtp_starttls=starttls, smtp_skip_login=smtp_skip_login
        )
        self.token_service = token_service

    def send(self, email, subject, message):
        return self.smtp.send(email, subject, message)

    def send_confirmation_email(self, user, request):
            token = self.token_service.create(
                user.email, 'email-confirmation-salt'
            )

            confirm_url = request.application_url + request.class_link(
                ConfirmEmail,
                variables={'id': user.id, 'token': token}
            )

            with open("server/templates/email_confirmation.html") as f:
                email_template = f.read()

            html = email_template.format(confirm_url=confirm_url)

            self.send(user.email, 'Confirm Your Email Address', html)

    def send_reset_email(self, user, request):
            token = self.token_service.create(
                user.email, 'password-reset-salt'
            )

            reset_url = request.application_url + request.class_link(
                ResetPassword,
                variables={'id': user.id, 'token': token}
            )

            with open("server/templates/password_reset.html") as f:
                email_template = f.read()

            html = email_template.format(reset_url=reset_url)

            self.send(user.email, 'Password Reset Requested', html)


@App.method(App.service, name='mailer')
def mailer_service(app, name):
    username = getattr(app.settings.smtp, 'username', None)
    password = getattr(app.settings.smtp, 'password', None)
    host = getattr(app.settings.smtp, 'host', 'smtp.gmail.com')
    port = getattr(app.settings.smtp, 'port', '587')
    starttls = getattr(app.settings.smtp, 'starttls', True)
    smtp_skip_login = getattr(app.settings.smtp, 'smtp_skip_login', False)
    token_service = app.service(name='token')

    return MailerService(
        username=username, password=password, host=host,
        port=port, starttls=starttls, smtp_skip_login=smtp_skip_login,
        token_service=token_service
    )


class EmailValidationService(object):
    def normalize(self, email):
        try:
            v = validate_email(email, check_deliverability=False)
            normalized_email = v['email']
            if v['domain_i18n'] == 'googlemail.com':
                normalized_email = v['local'] + '@gmail.com'

            return normalized_email

        except EmailSyntaxError:
            return email

    def verify(self, email):
        v = validate_email(email, check_deliverability=True)
        verified_email = v['email']

        return verified_email


@App.method(App.service, name='email_validation')
def email_validation_service(app, name):
    return EmailValidationService()


class TokenService(object):
    def __init__(self, secret, max_age=None):
        self.serializer = URLSafeTimedSerializer(secret)
        self.max_age = max_age

    def create(self, obj, salt='token-service-salt'):
        return self.serializer.dumps(obj, salt=salt)

    def validate(self, token, salt='token-service-salt'):
        try:
            self.serializer.loads(token, salt=salt, max_age=self.max_age)
        except BadSignature:
            return False

        return True


@App.method(App.service, name='token')
def token_service(app, name):
    secret = app.settings.token.secret
    max_age = app.settings.token.max_age
    return TokenService(secret=secret, max_age=max_age)
