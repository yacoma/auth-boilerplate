import yaml
from pony.orm import db_session
from pymitter import EventEmitter

import morepath
from reg import match_key
from more.jwtauth import JWTIdentityPolicy
from more.cerberus import CerberusApp


class App(CerberusApp):

    signal = EventEmitter()

    @morepath.dispatch_method(match_key('name'))
    def service(self, name):
        raise NotImplementedError   # pragma: no cover


with open('server/settings/default.yml') as defaults:
    defaults_dict = yaml.load(defaults)

App.init_settings(defaults_dict)


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


@App.link_prefix()
def simple_link_prefix(request):
    return ''


class ProductionApp(App):
    pass


with open('server/settings/production.yml') as settings:
    settings_dict = yaml.load(settings)

ProductionApp.init_settings(settings_dict)


class TestApp(App):
    pass


with open('server/settings/test.yml') as settings:
    settings_dict = yaml.load(settings)

TestApp.init_settings(settings_dict)
