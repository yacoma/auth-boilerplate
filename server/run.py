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


def wsgi_factory():   # pragma: no cover
    morepath.autoscan()
    App.commit()

    app = App()

    setup_db(app)

    @webob.dec.wsgify
    def morepath_with_static_absorb(request):
        popped = request.path_info_pop()
        if popped == 'api':
            return request.get_response(app)
        elif popped == 'static':
            static = DirectoryApp('static')
            return request.get_response(static)
        else:
            query = ''
            if request.query_string:
                query = '?' + request.query_string
            index_path = 'static/index.html' + query
            index = FileApp(index_path)
            return request.get_response(index)

    return morepath_with_static_absorb


application = wsgi_factory()   # pragma: no cover
