import os
import sys

SERVER_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_ROOT = os.path.dirname(os.path.abspath(SERVER_ROOT))
sys.path.insert(0, APP_ROOT)
sys.path.insert(0, SERVER_ROOT)
print(sys.path)

from argon2 import PasswordHasher
import morepath
from pony.orm import db_session
import webob
from webob.static import DirectoryApp, FileApp
from .app import App
from .model import db, User, Group


@db_session
def add_admin():   # pragma: no cover
    if not User.exists():
        if not Group.exists(name='Admin'):
            admin = Group(name='Admin')

        ph = PasswordHasher()
        password_hash = ph.hash('admin0')
        User(
            nickname='Admin',
            email='admin@example.com',
            password=password_hash,
            groups=[admin]
        )


def setup_db(app):
    provider = app.settings.database.provider
    args = app.settings.database.args
    kwargs = app.settings.database.kwargs
    try:
        db.bind(provider, *args, **kwargs)
    except TypeError:
        pass
    else:
        db.generate_mapping(create_tables=True)
    add_admin()


def run():   # pragma: no cover
    morepath.autoscan()

    index = FileApp('static/index.html')
    static = DirectoryApp('static')
    app = App()

    setup_db(app)

    @webob.dec.wsgify
    def morepath_with_static_absorb(request):
        popped = request.path_info_pop()
        if popped == 'api':
            return request.get_response(app)
        elif popped == 'static':
            return request.get_response(static)
        else:
            return request.get_response(index)

    morepath.run(morepath_with_static_absorb)


def wsgi_factory():
    morepath.autoscan()
    App.commit()
    app = App()

    setup_db(app)

    return app


application = wsgi_factory()
