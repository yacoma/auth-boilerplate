import yaml

import morepath
from reg import match_key
from more.jwtauth import JWTIdentityPolicy
from more.cerberus import CerberusApp
from more.pony import PonyApp
from more.emit import EmitApp


class App(CerberusApp, PonyApp, EmitApp):

    @morepath.dispatch_method(match_key('name'))
    def service(self, name):
        raise NotImplementedError   # pragma: no cover


with open('server/settings/default.yml') as defaults:
    defaults_dict = yaml.safe_load(defaults)

App.init_settings(defaults_dict)


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
    settings_dict = yaml.safe_load(settings)

ProductionApp.init_settings(settings_dict)


class TestApp(App):
    pass


with open('server/settings/test.yml') as settings:
    settings_dict = yaml.safe_load(settings)

TestApp.init_settings(settings_dict)
