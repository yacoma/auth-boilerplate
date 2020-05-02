import os

from webtest import TestApp as Client
import morepath

import server
from server import TestApp as App


def setup_module(module):
    morepath.scan(server)
    morepath.commit(App)


def test_run_env():
    assert os.getenv("RUN_ENV") == "test"


def test_settings():
    app = App()

    assert app.settings.smtp.username == "test@example.com"
    assert app.settings.smtp.port == "3377"
    assert app.settings.database.filename == ":memory:"


def test_root():
    app = App()
    c = Client(app)

    response = c.get("/")
    assert response.json == {
        "collections": {"users": {"@id": "/users"}, "groups": {"@id": "/groups"}}
    }
