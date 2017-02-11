from .app import App


@App.signal.on('user.created')
def send_confirmation_email(user, request):
    settings = request.app.settings
    mailer = request.app.service(name='mailer')

    if settings.authentication.confirm_email \
            and not user.email_confirmed:
        mailer.send_confirmation_email(user, request)
