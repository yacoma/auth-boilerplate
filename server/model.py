from datetime import datetime
from argon2 import PasswordHasher
from pony.orm import Database, Required, Optional, Set

db = Database()


class Root(object):
    pass


class Login(object):
    pass


class ConfirmEmail(object):
    def __init__(self, id, token):
        self.id = id
        self.token = token


class SendResetEmail(object):
    pass


class ResetPassword(object):
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
    password = Required(str, 255)
    language = Optional(str, 16)
    creation_ip = Optional(str, 255)
    groups = Set('Group')
    create_time = Required(datetime, 0, default=datetime.now)
    last_logged_in = Optional(datetime, 0)

    def update(self, payload={}):
        update_payload = {}
        for attribute, value in payload.items():
            if attribute == 'groups':
                for group_id in value:
                    self.groups.add(Group[group_id])
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
    basegroups = Set('Group', reverse='subgroups')
    subgroups = Set('Group')
    users = Set(User)

    def before_insert(self):
        self.basegroups.add(self)

    def update(self, payload={}):
        update_payload = {}
        for attribute, value in payload.items():
            if attribute == 'basegroups':
                for group_id in value:
                    self.basegroups.add(Group[group_id])
            elif attribute == 'subgroups':
                for group_id in value:
                    self.subgroups.add(Group[group_id])
            elif attribute == 'users':
                for user_id in value:
                    self.users.add(User[user_id])
            else:
                update_payload[attribute] = value
        self.set(**update_payload)

    def remove(self):
        self.delete()
