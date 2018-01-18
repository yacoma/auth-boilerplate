from .model import User


def refresh_nonce_handler(request, userid):
    return User.get(email=userid).nonce
