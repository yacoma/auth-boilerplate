import json
from argon2 import PasswordHasher
from pony.orm import db_session
from webtest import TestApp as Client

import morepath
from .utils import assert_dict_contains_subset

import server
from server import App
from server.model import db, User, Group


def setup_module(module):
    morepath.scan(server)
    morepath.commit(App)

    try:
        db.bind('sqlite', ':memory:')
    except TypeError:
        pass
    else:
        db.generate_mapping(check_tables=False)


def setup_function(function):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()

    ph = PasswordHasher()

    with db_session:
        editor = Group(id=3, name='Editor')
        moderator = Group(id=2, name='Moderator', basegroups=[editor])
        admin = Group(id=1, name='Admin', basegroups=[moderator, editor])

        User(id=1, nickname='Leader', email='leader@example.com',
             password=ph.hash('test1'), groups=[admin])
        User(id=2, nickname='Mary', email='mary@example.com',
             password=ph.hash('test2'), groups=[moderator])
        User(id=3, nickname='Mike', email='mike@example.com',
             password=ph.hash('test3'), groups=[editor])


def test_login():
    c = Client(App())

    response = c.post(
        '/login',
        json.dumps({"email": "mary@example.com", "password": "false"}),
        status=403
    )
    assert response.json == {
        "validationError": "Invalid username or password"
    }

    response = c.post(
        '/login',
        json.dumps({"email": "not_exists@example.com", "password": "test2"}),
        status=403
    )
    assert response.json == {
        "validationError": "Invalid username or password"
    }

    response = c.post(
        '/login',
        json.dumps({"email": "mary@example.com", "password": "test2"})
    )
    assert response.json == {
        "@id": "http://localhost/users/2",
        "@type": "http://localhost/users"
    }


def test_user():
    c = Client(App())
    response = c.get('/users/1')
    user = {
        "@id": "http://localhost/users/1",
        "@type": "http://localhost/users",
        "nickname": "Leader",
        "email": "leader@example.com",
        "groups": ["Admin"]
    }
    assert_dict_contains_subset(user, response.json)


def test_add_user():
    c = Client(App(), extra_environ=dict(REMOTE_ADDR='127.0.0.1'))

    new_user_json = json.dumps({
        "nickname": "NewUser",
        "email": "newuser@example.com",
        "password": "test7",
        "language": "de_DE"
    })

    response = c.post('/users', new_user_json, status=201)
    assert response.json == {
        "@id": "http://localhost/users/4",
        "@type": "http://localhost/users"
    }
    with db_session:
        assert User.exists(nickname='NewUser')
        assert User.get(nickname='NewUser').language == 'de_DE'
        assert User.get(nickname='NewUser').creation_ip == '127.0.0.1'

    response = c.post('/users', new_user_json, status=409)
    assert response.json == {
        "integrityError": "Email already exists"
    }

    with db_session:
        editor_id = Group.get(name='Editor').get_pk()
        new_editor_json = json.dumps({
            "nickname": "NewEditor",
            "email": "neweditor@example.com",
            "password": "test8",
            "groups": [editor_id]
        })
        c.post('/users', new_editor_json)

        assert User.exists(nickname='NewEditor')
        assert Group.get(name='Editor') \
            in User.get(nickname='NewEditor').groups


def test_update_user():
    c = Client(App())

    update_user_json = json.dumps({"nickname": "Guru"})
    c.put('/users/1', update_user_json)

    with db_session:
        assert User[1].nickname == "Guru"

    update_user_json = json.dumps({"password": "secret0"})
    c.put('/users/1', update_user_json)

    ph = PasswordHasher()
    with db_session:
        assert ph.verify(User[1].password, 'secret0')

        moderator_id = Group.get(name='Moderator').get_pk()
        update_user_json = json.dumps({"groups": [moderator_id]})
        c.put('/users/3', update_user_json)

        u = User[3]
        editor = Group.get(name='Editor')
        moderator = Group.get(name='Moderator')

        assert editor in u.groups
        assert moderator in u.groups


def test_delete_user():
    c = Client(App())

    with db_session:
        assert User.exists(nickname='Mary')

    c.delete('/users/2')

    with db_session:
        assert not User.exists(nickname='Mary')
