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


def run():   # pragma: no cover
    db.bind('sqlite', 'auth.db', create_db=True)
    db.generate_mapping(create_tables=True)

    morepath.autoscan()

    index = FileApp('static/index.html')
    static = DirectoryApp('static')
    app = App()

    add_admin()

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
