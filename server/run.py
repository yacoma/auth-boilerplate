import os

from argon2 import PasswordHasher
from pony.orm import db_session
import webob
from webob.static import DirectoryApp, FileApp
import morepath

from server import App, ProductionApp, TestApp
from .model import db, User, Group


@db_session
def add_admin():  # pragma: no cover
    if not User.exists():
        if not Group.exists(name="Admin"):
            admin = Group(name="Admin")

        ph = PasswordHasher()
        password_hash = ph.hash("admin0")
        User(
            nickname="Admin",
            email="admin@example.com",
            email_confirmed=True,
            password=password_hash,
            groups=[admin],
        )


def setup_db(app):
    db_params = app.settings.database.__dict__.copy()
    db.bind(**db_params)
    db.generate_mapping(create_tables=True)
    add_admin()


def wsgi_factory():  # pragma: no cover
    morepath.autoscan()

    if os.getenv("RUN_ENV") == "production":
        ProductionApp.commit()
        app = ProductionApp()
    elif os.getenv("RUN_ENV") == "test":
        TestApp.commit()
        app = TestApp()
    else:
        App.commit()
        app = App()

    index = FileApp("build/index.html")
    static = DirectoryApp("build", index_page=None)

    setup_db(app)

    @webob.dec.wsgify
    def morepath_with_static_absorb(request):
        popped = request.path_info_pop()
        if popped == "api":
            return request.get_response(app)
        elif popped == "static":
            return request.get_response(static)
        else:
            return request.get_response(index)

    return morepath_with_static_absorb


application = wsgi_factory()  # pragma: no cover
