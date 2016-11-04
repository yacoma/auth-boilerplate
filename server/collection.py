from argon2 import PasswordHasher
from .model import User, Group


class UserCollection(object):
    def query(self):
        return User.select()

    def add(self, nickname, email, password,
            language='', creation_ip='', group_ids=[]):
        ph = PasswordHasher()
        password_hash = ph.hash(password)
        groups = []
        if group_ids:
            for group_id in group_ids:
                groups.append(Group[group_id])
        user = User(
            nickname=nickname, email=email, password=password_hash,
            language=language, creation_ip=creation_ip, groups=groups
        )
        user.flush()
        return user


class GroupCollection(object):
    def query(self):
        return Group.select()

    def add(self, name, basegroup_ids=[]):
        basegroups = []
        if basegroup_ids:
            for group_id in basegroup_ids:
                basegroups.append(Group[group_id])
        group = Group(name=name, basegroups=basegroups)
        group.flush()
        return group
