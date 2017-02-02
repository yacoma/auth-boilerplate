from .app import App
from .model import ConfirmEmail


@App.signal.on('user.created')
def send_confirmation_mail(user, request):
    settings = request.app.settings
    token_service = request.app.service(name='token')
    mailer = request.app.service(name='mailer')

    if settings.authentication.confirm_email \
            and not user.email_confirmed:
        token = token_service.create(user.email, 'email-confirmation-salt')

        confirm_url = request.class_link(
            ConfirmEmail,
            variables={'id': user.id, 'token': token}
        )

        with open("server/templates/email_confirmation.html") as f:
            email_template = f.read()

        html = email_template.format(confirm_url=confirm_url)

        mailer.send(user.email, 'Confirm Your Email Address', html)
