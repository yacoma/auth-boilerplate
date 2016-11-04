import json
from pony.orm import db_session

import morepath
from more.jwtauth import JWTIdentityPolicy


class App(morepath.App):
    pass


with open('settings.json') as config:
     settings_dict = json.load(config)

App.init_settings(settings_dict)


@App.tween_factory(over=morepath.EXCVIEW)
def pony_tween_factory(app, handler):

    @db_session
    def pony_tween(request):
        return handler(request)

    return pony_tween


@App.identity_policy()
def get_identity_policy(settings):
    jwtauth_settings = settings.jwtauth.__dict__.copy()
    return JWTIdentityPolicy(**jwtauth_settings)


@App.verify_identity()
def verify_identity(identity):
    return True
