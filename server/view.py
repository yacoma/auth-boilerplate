from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

import morepath
from morepath import redirect

from .app import App
from .collection import UserCollection, GroupCollection
from .model import Root, Login, User, Group


@App.json(model=Root)
def root_default(self, request):
    return redirect('/api/users')


@App.json(model=Login, request_method='POST')
def login(self, request):
    email = request.json['email']
    password = request.json['password']

    ph = PasswordHasher()
    u = User.get(email=email)
    valid_credentials = False
    if u:
        try:
            ph.verify(u.password, password)
        except(VerifyMismatchError):
            pass
        else:
            valid_credentials = True

    if valid_credentials:
        @request.after
        def remember(response):
            admin = Group.get(name='Admin')
            is_admin = False
            # Checks if user is member of Admin group or a group to which
            # belong Admin group (recursive).
            if u.groups and admin:
                is_admin = admin in u.groups.basegroups
            identity = morepath.Identity(email, nickname=u.nickname,
                                         language=u.language, isAdmin=is_admin)
            request.app.remember_identity(response, request, identity)

        return {
            '@id': request.class_link(User, variables={'id': u.id}),
            '@type': request.class_link(UserCollection)
        }

    else:
        @request.after
        def credentials_not_valid(response):
            response.status_code = 403

        return {'validationError': 'Invalid username or password'}


@App.json(model=User)
def user_get(self, request):
    return {
        '@id': request.link(self),
        '@type': request.class_link(UserCollection),
        'nickname': self.nickname,
        'email': self.email,
        'language': self.language,
        'groups': [group.name for group in self.groups],
    }


@App.json(model=UserCollection)
def user_collection_get(self, request):
    return {
        'users': [request.view(user) for user in self.query()]
    }


@App.json(model=UserCollection, request_method='POST')
def user_collection_add(self, request):
    nickname = request.json.get('nickname')
    email = request.json.get('email')
    password = request.json.get('password')
    locale_settings = request.app.settings.locale
    preferred_language = request.accept_language.best_match(
        locale_settings.accepted_languages,
        default_match=locale_settings.default_language
    )
    language = request.json.get('language', preferred_language)
    group_ids = request.json.get('groups', [])
    creation_ip = request.remote_addr

    if not User.exists(email=email):
        user = self.add(
            nickname=nickname, email=email, password=password,
            language=language, creation_ip=creation_ip, group_ids=group_ids
        )

        @request.after
        def after(response):
            response.status = 201

        return {
            '@id': request.class_link(User, variables={'id': user.id}),
            '@type': request.class_link(UserCollection)
        }

    else:
        @request.after
        def after(response):
            response.status = 409

        return {
            'integrityError': 'Email already exists'
        }


@App.json(model=User, request_method='PUT')
def user_update(self, request):
    self.update(request.json)


@App.json(model=User, request_method='DELETE')
def user_remove(self, request):
    self.remove()


@App.json(model=Group)
def group_get(self, request):
    return {
        '@id': request.link(self),
        '@type': request.class_link(GroupCollection),
        'name': self.name,
        'basegroups': [group.name for group in self.basegroups],
        'subgroups': [group.name for group in self.subgroups],
        'users': [user.nickname for user in self.users]
    }


@App.json(model=GroupCollection)
def group_collection_get(self, request):
    return {
        'groups': [request.view(group) for group in self.query()]
    }


@App.json(model=GroupCollection, request_method='POST')
def group_collection_add(self, request):
    name = request.json.get('name')
    basegroup_ids = request.json.get('basegroups', [])
    group = self.add(name=name, basegroup_ids=basegroup_ids)

    @request.after
    def after(response):
        response.status = 201

    return group.id


@App.json(model=Group, request_method='PUT')
def group_update(self, request):
    self.update(request.json)


@App.json(model=Group, request_method='DELETE')
def group_remove(self, request):
    self.remove()
