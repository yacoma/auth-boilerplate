from itsdangerous import URLSafeTimedSerializer, BadSignature
import yagmail

from .app import App
from .utils import normalize_email


class MailerService(object):
    def __init__(self, username, password, host, port,
                 starttls, smtp_skip_login):
        self.smtp = yagmail.SMTP(
            username, password, host, port,
            smtp_starttls=starttls, smtp_skip_login=smtp_skip_login
        )

    def send(self, email, subject, message):
        return self.smtp.send(email, subject, message)


@App.method(App.service, name='mailer')
def mailer_service(app, name):
    username = getattr(app.settings.smtp, 'username', None)
    password = getattr(app.settings.smtp, 'password', None)
    host = getattr(app.settings.smtp, 'host', 'smtp.gmail.com')
    port = getattr(app.settings.smtp, 'port', '587')
    starttls = getattr(app.settings.smtp, 'starttls', True)
    smtp_skip_login = getattr(app.settings.smtp, 'smtp_skip_login', False)

    return MailerService(
        username=username, password=password, host=host,
        port=port, starttls=starttls, smtp_skip_login=smtp_skip_login
    )


class EmailValidationService(object):
    def normalize(self, email, check_deliverability=False):
        return normalize_email(email, check_deliverability)


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
