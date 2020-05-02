from math import ceil

from argon2 import PasswordHasher
from pony.orm import desc, count

from .model import User, Group


class UserCollection:
    def __init__(self, sort_by, sort_dir, search, page, pagesize):
        if sort_by == "emailConfirmed":
            self.sort_by = "email_confirmed"
        elif sort_by == "lastLogin":
            self.sort_by = "last_login"
        elif sort_by == "registerIP":
            self.sort_by = "register_ip"
        else:
            self.sort_by = sort_by

        self.sort_dir = sort_dir
        self.search = search
        if page > 0 and pagesize > 0:
            self.page = page
            self.pagesize = pagesize
            self.pages = ceil(count(u for u in User) / pagesize)
        else:
            self.page = 0

    def query(self):
        user_select = User.select()
        if self.search:
            s = self.search.lower()
            user_select = User.select(
                lambda u: s in u.email.lower() or s in u.nickname.lower()
            )
        if self.sort_by:
            if self.sort_dir == "desc":
                sort_by = desc(getattr(User, self.sort_by))
            else:
                sort_by = getattr(User, self.sort_by)

            user_select = user_select.sort_by(sort_by)
        if self.page:
            user_select = user_select.page(self.page, pagesize=self.pagesize)

        return user_select

    def add(self, nickname, email, password, register_ip="", group_names=[]):
        ph = PasswordHasher()
        password_hash = ph.hash(password)
        groups = []
        if group_names:
            for group_name in group_names:
                groups.append(Group.get(name=group_name))
        user = User(
            nickname=nickname,
            email=email,
            password=password_hash,
            register_ip=register_ip,
            groups=groups,
        )
        user.flush()
        return user


class GroupCollection:
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
