import os

from argon2 import PasswordHasher
from pony.orm import db_session
import webob
from webob.static import DirectoryApp, FileApp
import morepath

from server import App, ProductionApp
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


def wsgi_factory():   # pragma: no cover
    morepath.autoscan()

    if os.getenv('MOREPATH_ENV') == 'production':
        ProductionApp.commit()
        app = ProductionApp()
    else:
        App.commit()
        app = App()

    index = FileApp('static/index.html')
    static = DirectoryApp('static')

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

    return morepath_with_static_absorb


application = wsgi_factory()   # pragma: no cover
