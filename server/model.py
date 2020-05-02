from datetime import datetime
from uuid import uuid4
from argon2 import PasswordHasher
from pony.orm import Database, Required, Optional, Set

db = Database()


class Root:
    pass


class Login:
    pass


class Refresh:
    pass


class ResetNonce:
    def __init__(self, id):
        self.id = id

    def reset_nonce(self):
        user = User[self.id]
        user.nonce = uuid4().hex


class ConfirmEmail:
    def __init__(self, id, token):
        self.id = id
        self.token = token


class SendResetEmail:
    pass


class ResetPassword:
    def __init__(self, id, token):
        self.id = id
        self.token = token

    def update(self, password):
        ph = PasswordHasher()
        password_hash = ph.hash(password)
        user = User[self.id]
        user.password = password_hash


class User(db.Entity):
    _table_ = 'users'

    nickname = Required(str, 255)
    email = Required(str, 255, unique=True)
    email_confirmed = Required(bool, default=False)
    last_login = Optional(datetime, 0)
    registered = Required(datetime, 0, default=datetime.utcnow)
    register_ip = Optional(str, 255)
    groups = Set('Group')
    password = Required(str, 255)
    nonce = Required(str, 32, default=uuid4().hex)

    def update(self, payload={}):
        update_payload = {}
        for attribute, value in payload.items():
            if attribute == 'groups':
                group_names = []
                for group in value:
                    group_names.append(Group.get(name=group))
                update_payload['groups'] = group_names
            elif attribute == 'password':
                ph = PasswordHasher()
                password_hash = ph.hash(value)
                update_payload['password'] = password_hash
            else:
                update_payload[attribute] = value
        self.set(**update_payload)

    def remove(self):
        self.delete()


class Group(db.Entity):
    name = Required(str, 255, unique=True)
    users = Set(User)

    def update(self, payload={}):
        update_payload = {}
        for attribute, value in payload.items():
            if attribute == 'users':
                user_emails = []
                for user_email in value:
                    user_emails.append(User.get(email=user_email))
                update_payload['users'] = user_emails
            else:
                update_payload[attribute] = value
        self.set(**update_payload)

    def remove(self):
        self.delete()
