from base64 import urlsafe_b64encode
from calendar import timegm
from datetime import datetime
import json
from uuid import uuid4

from argon2 import PasswordHasher
import morepath
from more.jwtauth import JWTIdentityPolicy
from pony.orm import db_session
from webtest import TestApp as Client

import server
from server import TestApp as App
from server.model import db, User, Group

from .utils import assert_dict_contains_subset


def setup_module(module):
    morepath.scan(server)
    morepath.commit(App)


def setup_function(function):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()

    ph = PasswordHasher()

    with db_session:
        editor = Group(id=3, name='Editor')
        moderator = Group(id=2, name='Moderator')
        admin = Group(id=1, name='Admin')

        User(id=1, nickname='Leader', email='leader@example.com',
             password=ph.hash('test1'), groups=[admin])
        User(id=2, nickname='Mary', email='mary@example.com',
             password=ph.hash('test2'), groups=[moderator])
        User(id=3, nickname='Jürgen', email='juergen@example.com',
             password=ph.hash('test3'), groups=[editor])


def test_login():
    app = App()
    c = Client(app)

    response = c.post(
        '/login',
        json.dumps({"email": "mary@example.com", "password": "false"}),
        status=403
    )
    assert response.json == {
        "validationError": "Invalid email or password"
    }

    response = c.post(
        '/login',
        json.dumps({"email": "not_exists@example.com", "password": "test2"}),
        status=403
    )
    assert response.json == {
        "validationError": "Invalid email or password"
    }

    response = c.post(
        '/login',
        json.dumps({"email": "test@example", "password": "secret"}),
        status=403
    )
    assert response.json == {
        "validationError": "Invalid email or password"
    }

    response = c.post(
        '/login',
        json.dumps({"email": "mary@EXAMPLE.COM", "password": "test2"})
    )

    jwtauth_settings = app.settings.jwtauth.__dict__.copy()
    identity_policy = JWTIdentityPolicy(**jwtauth_settings)

    authtype, token = response.headers['Authorization'].split(' ', 1)
    claims_set_decoded = identity_policy.decode_jwt(token)

    assert identity_policy.get_userid(claims_set_decoded) == 'mary@example.com'


def test_refresh_token():
    app = App()
    c = Client(app)

    response = c.post(
        '/login',
        json.dumps({"email": "mary@example.com", "password": "test2"})
    )

    headers = {'Authorization': response.headers['Authorization']}

    response = c.get('/refresh', headers=headers)

    jwtauth_settings = app.settings.jwtauth.__dict__.copy()
    identity_policy = JWTIdentityPolicy(**jwtauth_settings)

    authtype, token = response.headers['Authorization'].split(' ', 1)
    claims_set_decoded = identity_policy.decode_jwt(token)

    assert identity_policy.get_userid(claims_set_decoded) == 'mary@example.com'

    with db_session:
        # set new nonce to invalid current tokens for this user
        User[2].nonce = uuid4().hex

    response = c.get('/refresh', headers=headers, status=403)
    assert response.json == {
        'validationError': 'Could not refresh your token'
    }

    now = timegm(datetime.utcnow().utctimetuple())

    with db_session:
        nonce = User.get(email='mary@example.com').nonce

    claims_set = {
        'sub': 'mary@example.com',
        'uid': '/user/2',
        'refresh_until': now - 3,
        'nonce': nonce,
        'exp': now + 3
    }

    token = identity_policy.encode_jwt(claims_set)
    headers = {'Authorization': 'JWT ' + token}

    response = c.get('/refresh', headers=headers, status=403)
    assert response.json == {
        'validationError': 'Your session has expired'
    }


def test_reset_nonce():
    c = Client(App())

    with db_session:
        original_nonce = User[1].nonce

    c.get('/users/1/signout')

    with db_session:
        assert User[1].nonce != original_nonce


def test_user():
    c = Client(App())

    response = c.post(
        '/login',
        json.dumps({"email": "mary@example.com", "password": "test2"})
    )

    headers = {'Authorization': response.headers['Authorization']}

    response = c.get('/users/2', headers=headers)
    user = {
        "@id": "/users/2",
        "nickname": "Mary",
        "email": "mary@example.com",
        "isAdmin": False,
        "emailConfirmed": False,
        "registerIP": '',
    }

    assert_dict_contains_subset(user, response.json)


def test_user_collection():
    c = Client(App())

    response = c.post(
        '/login',
        json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {'Authorization': response.headers['Authorization']}

    response = c.get('/users', headers=headers)
    user_1 = {
        "@id": "/users/1",
        "nickname": "Leader",
        "email": "leader@example.com",
        "emailConfirmed": False,
        "isAdmin": True,
        "registerIP": '',
    }

    assert_dict_contains_subset(user_1, response.json['users'][0])


def test_sorted_user_collection():
    c = Client(App())

    with db_session:
        User[1].email_confirmed = True

    response = c.post(
        '/login',
        json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {'Authorization': response.headers['Authorization']}

    response = c.get('/users?sortby=nickname', headers=headers)

    assert response.json['users'][0]['nickname'] == 'Jürgen'

    response = c.get('/users?sortby=email&sortdir=desc', headers=headers)

    assert response.json['users'][0]['email'] == 'mary@example.com'

    response = c.get('/users?sortby=emailConfirmed', headers=headers)

    assert response.json['users'][0]['nickname'] == 'Mary'

    response = c.get('/users?sortby=lastLogin', headers=headers)

    assert response.json['users'][0]['nickname'] == 'Mary'

    response = c.get('/users?sortby=registerIP', headers=headers)

    assert response.json['users'][0]['nickname'] == 'Leader'


def test_paginated_user_collection():
    c = Client(App())

    response = c.post(
        '/login',
        json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {'Authorization': response.headers['Authorization']}

    response = c.get('/users?page=1&pagesize=2', headers=headers)

    assert len(response.json['users']) == 2
    assert response.json['pages'] == 2

    response = c.get('/users?page=2&pagesize=2', headers=headers)

    assert len(response.json['users']) == 1
    assert response.json['pages'] == 2


def test_search_user_collection():
    c = Client(App())

    response = c.post(
        '/login',
        json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {'Authorization': response.headers['Authorization']}

    response = c.get('/users?search=j%C3%BCrgen', headers=headers)

    assert len(response.json['users']) == 1
    assert response.json['users'][0]['nickname'] == 'Jürgen'

    response = c.get('/users?search=leader@example.com', headers=headers)

    assert len(response.json['users']) == 1
    assert response.json['users'][0]['nickname'] == 'Leader'

    response = c.get('/users?search=example.com', headers=headers)

    assert len(response.json['users']) == 3


def test_user_collection_combined_query():
    c = Client(App())

    response = c.post(
        '/login',
        json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {'Authorization': response.headers['Authorization']}

    response = c.get(
        '/users?search=example.com&sortby=nickname&page=1&pagesize=2',
        headers=headers
    )

    assert len(response.json['users']) == 2
    assert response.json['pages'] == 2
    assert response.json['users'][0]['nickname'] == 'Jürgen'


def test_add_user(smtp):
    assert len(smtp.outbox) == 0

    c = Client(App(), extra_environ=dict(REMOTE_ADDR='127.0.0.1'))

    new_user_json = json.dumps({
        "nickname": "NewUser",
        "email": "newuser@example.com",
        "password": "test7",
    })

    response = c.post('/users', new_user_json, status=201)
    with db_session:
        assert User.exists(nickname='NewUser')
        assert User.get(nickname='NewUser').register_ip == '127.0.0.1'

    assert len(smtp.outbox) == 1
    message = smtp.outbox[0]
    assert message['subject'] == 'Confirm Your Email Address'
    assert message['To'] == 'newuser@example.com'

    response = c.post('/users', new_user_json, status=409)
    assert response.json == {
        "validationError": "Email already exists"
    }

    assert len(smtp.outbox) == 1

    with db_session:
        new_editor_json = json.dumps({
            "nickname": "NewEditor",
            "email": "neweditor@GoogleMail.com",
            "password": "test8",
            "groups": ["Editor"]
        })
        c.post('/users', new_editor_json)

        assert User.exists(nickname='NewEditor')
        assert Group.get(name='Editor') \
            in User.get(nickname='NewEditor').groups
        assert User.get(nickname='NewEditor').email == 'neweditor@gmail.com'

    assert len(smtp.outbox) == 2
    message = smtp.outbox[1]
    assert message['subject'] == 'Confirm Your Email Address'
    assert message['To'] == 'neweditor@gmail.com'

    new_user_json = json.dumps({
        "nickname": "NewUser",
        "email": "newuser@this.server.doesnt.exist.com",
        "password": "test10"
    })

    response = c.post('/users', new_user_json, status=422)
    assert response.json == {
        'email': ['Email could not be delivered']
    }

    new_user_json = json.dumps({
        "nickname": "NewUser",
        "email": "newuser@example",
        "password": "test9"
    })

    response = c.post('/users', new_user_json, status=422)
    assert response.json == {
        'email': ['Not valid email']
    }


def test_update_user(smtp):
    c = Client(App())

    response = c.post(
        '/login',
        json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {'Authorization': response.headers['Authorization']}

    update_user_json = json.dumps({"nickname": "Guru"})
    c.put('/users/1', update_user_json, headers=headers)

    with db_session:
        assert User[1].nickname == "Guru"

    update_user_json = json.dumps({"nickname": "Guru"})
    c.put('/users/1', update_user_json, headers=headers)

    with db_session:
        assert User[1].nickname == "Guru"

    update_user_json = json.dumps({"email": "guru@example"})
    response = c.put('/users/1', update_user_json, headers=headers, status=422)
    assert response.json == {
        'email': ['Not valid email']
    }

    update_user_json = json.dumps({"email": "guru@EXAMPLE.COM"})
    c.put('/users/2', update_user_json, headers=headers)

    with db_session:
        assert User[2].email == "guru@example.com"

    assert len(smtp.outbox) == 1
    message = smtp.outbox[0]
    assert message['subject'] == 'Confirm Your Email Address'
    assert message['To'] == 'guru@example.com'

    response = c.put('/users/2', update_user_json, headers=headers, status=409)
    assert response.json == {
        "validationError": "Email already exists"
    }
    assert len(smtp.outbox) == 1

    update_user_json = json.dumps({"password": "secret0"})
    c.put('/users/1', update_user_json, headers=headers)

    ph = PasswordHasher()
    with db_session:
        assert ph.verify(User[1].password, 'secret0')

    update_user_json = json.dumps({'groups': ['Moderator']})
    c.put('/users/3', update_user_json, headers=headers)

    with db_session:
        u = User[3]
        editor = Group.get(name='Editor')
        moderator = Group.get(name='Moderator')

        assert editor not in u.groups
        assert moderator in u.groups

    update_user_json = json.dumps({'groups': []})
    c.put('/users/3', update_user_json, headers=headers)

    with db_session:
        u = User[3]
        editor = Group.get(name='Editor')
        moderator = Group.get(name='Moderator')

        assert editor not in u.groups
        assert moderator not in u.groups


def test_delete_user():
    c = Client(App())

    response = c.post(
        '/login',
        json.dumps({"email": "mary@example.com", "password": "test2"})
    )

    headers = {'Authorization': response.headers['Authorization']}

    with db_session:
        assert User.exists(nickname='Mary')

    c.delete('/users/2', headers=headers)

    with db_session:
        assert not User.exists(nickname='Mary')


def test_confirm_email():
    c = Client(App(), extra_environ=dict(REMOTE_ADDR='127.0.0.1'))

    new_user_json = json.dumps({
        "nickname": "NewUser",
        "email": "newuser@example.com",
        "password": "test7"
    })
    c.post('/users', new_user_json, status=201)

    response = c.get(
        '/users/4/confirm/' +
        'Im5ld.WrongToken.jFaRE',
        status=302
    )

    flash = urlsafe_b64encode(
        'The confirmation link is invalid or has been expired'.encode('utf-8')
    ).replace(b'=', b'').decode('utf-8')
    assert '302 Found' in response.text
    assert 'flash=' + flash in response.text
    assert 'flashtype=error' in response.text

    response = c.get(
        '/users/4/confirm/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C3dnsw.2meomRPK3wnYwB2AERt2ygjFaRE',
        status=302
    )

    flash = urlsafe_b64encode(
        'Thank you for confirming your email address'.encode('utf-8')
    ).replace(b'=', b'').decode('utf-8')
    assert '302 Found' in response.text
    assert 'flash=' + flash in response.text
    assert 'flashtype=success' in response.text

    response = c.get(
        '/users/4/confirm/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C3dnsw.2meomRPK3wnYwB2AERt2ygjFaRE',
        status=302
    )

    flash = urlsafe_b64encode(
        'Your email is already confirmed. Please log in.'.encode('utf-8')
    ).replace(b'=', b'').decode('utf-8')
    assert '302 Found' in response.text
    assert 'flash=' + flash in response.text
    assert 'flashtype=info' in response.text


def test_send_reset_email(smtp):
    c = Client(App(), extra_environ=dict(REMOTE_ADDR='127.0.0.1'))

    new_user_json = json.dumps({
        "nickname": "NewUser",
        "email": "newuser@example.com",
        "password": "test7"
    })
    c.post('/users', new_user_json, status=201)
    assert len(smtp.outbox) == 2

    response = c.post(
        '/reset',
        json.dumps({"email": "not_exist@example.com"}),
        status=403
    )
    assert response.json == {'validationError': 'Email not found'}

    response = c.post(
        '/reset',
        json.dumps({"email": "newuser@example.com"}),
        status=403
    )
    assert response.json == {
        'validationError':
        'Your email must be confirmed before resetting the password.'
    }

    c.get(
        '/users/4/confirm/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C3dnsw.2meomRPK3wnYwB2AERt2ygjFaRE',
        status=302
    )

    response = c.post(
        '/reset',
        json.dumps({"email": "newuser@example.com"})
    )

    assert len(smtp.outbox) == 3
    message = smtp.outbox[2]
    assert message['subject'] == 'Password Reset Requested'
    assert message['To'] == 'newuser@example.com'


def test_reset_password(smtp):
    c = Client(App(), extra_environ=dict(REMOTE_ADDR='127.0.0.1'))

    new_user_json = json.dumps({
        "nickname": "NewUser",
        "email": "newuser@example.com",
        "password": "test7"
    })
    c.post('/users', new_user_json, status=201)
    assert len(smtp.outbox) == 1

    response = c.get(
        '/users/4/reset/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.WrongToken.JrUGhlAxao46VsQevI',
        status=302
    )

    flash = urlsafe_b64encode(
        'The password reset link is invalid or has been expired'
        .encode('utf-8')
    ).replace(b'=', b'').decode('utf-8')
    assert '302 Found' in response.text
    assert 'flash=' + flash in response.text
    assert 'flashtype=error' in response.text

    response = c.get(
        '/users/4/reset/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C40RUQ.5JhlEE36_JrUGhlAxao46VsQevI',
        status=302
    )

    flash = urlsafe_b64encode(
        'Your email must be confirmed before resetting the password'
        .encode('utf-8')
    ).replace(b'=', b'').decode('utf-8')
    assert '302 Found' in response.text
    assert 'flash=' + flash in response.text
    assert 'flashtype=error' in response.text

    c.get(
        '/users/4/confirm/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C3dnsw.2meomRPK3wnYwB2AERt2ygjFaRE',
        status=302
    )

    response = c.get(
        '/users/4/reset/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C40RUQ.5JhlEE36_JrUGhlAxao46VsQevI',
        status=302
    )

    assert response.location == (
        'http://localhost/newpassword?%40id=%2Fusers%2F4%2Freset%2F' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C40RUQ.5JhlEE36_JrUGhlAxao46VsQevI'
    )


def test_update_password(smtp):
    c = Client(App(), extra_environ=dict(REMOTE_ADDR='127.0.0.1'))

    new_user_json = json.dumps({
        "nickname": "NewUser",
        "email": "newuser@example.com",
        "password": "test7"
    })
    c.post('/users', new_user_json, status=201)
    assert len(smtp.outbox) == 1

    update_password_json = json.dumps({"password": "new_secret"})
    response = c.put(
        '/users/4/reset/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.WrongToken.JrUGhlAxao46VsQevI',
        update_password_json,
        status=403
    )

    assert response.json == {
        'validationError':
        'The password reset link is invalid or has been expired'
    }

    response = c.put(
        '/users/4/reset/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C40RUQ.5JhlEE36_JrUGhlAxao46VsQevI',
        update_password_json,
        status=403
    )

    assert response.json == {
        'validationError':
        'Your email must be confirmed before resetting the password'
    }

    c.get(
        '/users/4/confirm/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C3dnsw.2meomRPK3wnYwB2AERt2ygjFaRE',
        status=302
    )

    response = c.put(
        '/users/4/reset/' +
        'Im5ld3VzZXJAZXhhbXBsZS5jb20i.C40RUQ.5JhlEE36_JrUGhlAxao46VsQevI',
        update_password_json
    )

    ph = PasswordHasher()
    with db_session:
        assert ph.verify(User[4].password, 'new_secret')
