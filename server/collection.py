from argon2 import PasswordHasher
from pony.orm import desc
from .model import User, Group


class UserCollection(object):
    def __init__(self, sort_by, sort_dir):
        if sort_by == 'emailConfirmed':
            self.sort_by = 'email_confirmed'
        elif sort_by == 'lastLogin':
            self.sort_by = 'last_login'
        elif sort_by == 'registerIP':
            self.sort_by = 'register_ip'
        else:
            self.sort_by = sort_by

        self.sort_dir = sort_dir

    def query(self):
        if self.sort_by == '':
            return User.select()
        else:
            if self.sort_dir == 'desc':
                sort_by = desc(getattr(User, self.sort_by))
            else:
                sort_by = getattr(User, self.sort_by)
            return User.select().order_by(sort_by)

    def add(self, nickname, email, password,
            language='', register_ip='', groups=[]):
        ph = PasswordHasher()
        password_hash = ph.hash(password)
        group_names = []
        if groups:
            for group in groups:
                group_names.append(Group.get(name=group))
        user = User(
            nickname=nickname, email=email, password=password_hash,
            language=language, register_ip=register_ip, groups=group_names
        )
        user.flush()
        return user


class GroupCollection(object):
    def query(self):
        return Group.select()

    def add(self, name, users=[]):
        user_emails = []
        if users:
            for user_email in users:
                user_emails.append(User.get(email=user_email))
        group = Group(name=name, users=user_emails)
        group.flush()
        return group
