import json
from pony.orm import db_session
from pymitter import EventEmitter

import morepath
from reg import match_key
from more.jwtauth import JWTIdentityPolicy


class App(morepath.App):

    ee = EventEmitter()

    @morepath.dispatch_method(match_key('name'))
    def service(self, name):
        raise NotImplementedError


with open('settings.json') as settings:
    settings_dict = json.load(settings)

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
