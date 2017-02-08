import os

import morepath

import server
from server import TestApp as App


def setup_module(module):
    morepath.scan(server)
    morepath.commit(App)


def test_run_env():
    assert os.getenv('RUN_ENV') == 'test'


def test_settings():
    app = App()

    assert app.settings.smtp.username == 'test@example.com'
    assert app.settings.smtp.port == '1125'
    assert app.settings.database.args == [':memory:']
