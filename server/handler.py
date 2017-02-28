from .model import User


def refresh_nonce_handler(userid):
    return User.get(email=userid).nonce
