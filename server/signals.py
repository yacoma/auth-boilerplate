from .app import App


@App.signal.on("user.email_updated")
def send_confirmation_email(user, request):
    mailer = request.app.service(name="mailer")
    mailer.send_confirmation_email(user, request)
