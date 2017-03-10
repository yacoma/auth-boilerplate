from base64 import urlsafe_b64encode
from datetime import datetime
from urllib.parse import urlencode

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import yaml

import morepath
from morepath import redirect
from more.cerberus import loader
from more.jwtauth import (
    verify_refresh_request, InvalidTokenError, ExpiredSignatureError
)

from .app import App
from .collection import UserCollection, GroupCollection
from .model import (Root, Login, Refresh, User, Group, ConfirmEmail,
                    ResetPassword, SendResetEmail)
from .validator import EmailValidator


with open('server/schema.yml') as schema:
    schema = yaml.load(schema)

login_validator = loader(schema['login'], EmailValidator)
user_validator = loader(schema['user'], EmailValidator)
group_validator = loader(schema['group'])
send_reset_email_validator = loader(schema['send_reset_email'], EmailValidator)
reset_password_validator = loader(schema['reset_password'], update=False)


@App.json(model=Root)
def root_default(self, request):
    return {
        'collections': {
            'users': {
                '@id': request.class_link(UserCollection)
            },
            'groups': {
                '@id': request.class_link(GroupCollection)
            },
        }
    }


@App.json(model=Login, request_method='POST', load=login_validator)
def login(self, request, json):
    email = json['email']
    password = json['password']

    ph = PasswordHasher()
    user = User.get(email=email)
    credentials_valid = False
    if user:
        try:
            ph.verify(user.password, password)
        except VerifyMismatchError:
            pass
        else:
            credentials_valid = True

        if credentials_valid and user.email_confirmed:
            user.last_logged_in = datetime.now()

            @request.after
            def remember(response):
                admin = Group.get(name='Admin')
                is_admin = False
                # Checks if user is member of Admin group.
                if user.groups and admin:
                    is_admin = admin in user.groups
                identity = morepath.Identity(email, nickname=user.nickname,
                                             language=user.language,
                                             isAdmin=is_admin)
                request.app.remember_identity(response, request, identity)

            return {
                '@id': request.class_link(User, variables={'id': user.id}),
                '@type': request.class_link(UserCollection)
            }

        elif not credentials_valid:
            @request.after
            def credentials_not_valid(response):
                response.status_code = 403

            return {'validationError': 'Invalid email or password'}

        else:
            @request.after
            def email_not_confirmed(response):
                response.status_code = 403

            return {
                'validationError':
                    'Your email address has not been confirmed yet'
            }

    else:
        @request.after
        def credentials_not_valid(response):
            response.status_code = 403

        return {'validationError': 'Invalid email or password'}


@App.json(model=Refresh)
def refresh(self, request):
    try:
        email = verify_refresh_request(request)
    except ExpiredSignatureError:
        @request.after
        def expired_nonce_or_token(response):
            response.status_code = 403
        return {'validationError': 'Your session has expired'}
    except InvalidTokenError:
        @request.after
        def invalid_token(response):
            response.status_code = 403
        return {'validationError': 'Could not refresh your token'}
    else:
        user = User.get(email=email)

        @request.after
        def remember(response):
            admin = Group.get(name='Admin')
            is_admin = False
            # Checks if user is member of Admin group.
            if user.groups and admin:
                is_admin = admin in user.groups
            identity = morepath.Identity(
                email, nickname=user.nickname,
                language=user.language, isAdmin=is_admin
            )
            request.app.remember_identity(response, request, identity)

        return {
            '@id': request.class_link(User, variables={'id': user.id}),
            '@type': request.class_link(UserCollection)
        }


@App.json(model=User)
def user_get(self, request):
    return {
        '@id': request.link(self),
        '@type': request.class_link(UserCollection),
        'nickname': self.nickname,
        'email': self.email,
        'email_confirmed': self.email_confirmed,
        'language': self.language,
        'groups': [group.name for group in self.groups],
    }


@App.json(model=UserCollection)
def user_collection_get(self, request):
    return {
        'users': [request.view(user) for user in self.query()]
    }


@App.json(model=UserCollection, request_method='POST', load=user_validator)
def user_collection_add(self, request, json):
    nickname = json['nickname']
    email = json['email']
    password = json['password']
    locale_settings = request.app.settings.locale
    preferred_language = request.accept_language.best_match(
        locale_settings.accepted_languages,
        default_match=locale_settings.default_language
    )
    language = json.get('language', preferred_language)
    group_ids = json.get('groups', [])
    creation_ip = request.remote_addr

    if not User.exists(email=email):
        user = self.add(
            nickname=nickname, email=email, password=password,
            language=language, creation_ip=creation_ip, group_ids=group_ids
        )

        @request.after
        def after(response):
            request.app.signal.emit('user.created', user, request)
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
            'validationError': 'Email already exists'
        }


@App.json(model=User, request_method='PUT', load=user_validator)
def user_update(self, request, json):
    self.update(json)


@App.json(model=User, request_method='DELETE')
def user_remove(self, request):
    self.remove()


@App.json(model=Group)
def group_get(self, request):
    return {
        '@id': request.link(self),
        '@type': request.class_link(GroupCollection),
        'name': self.name,
        'users': [user.email for user in self.users]
    }


@App.json(model=GroupCollection)
def group_collection_get(self, request):
    return {
        'groups': [request.view(group) for group in self.query()]
    }


@App.json(model=GroupCollection, request_method='POST', load=group_validator)
def group_collection_add(self, request, json):
    name = json.get('name')
    user_ids = json.get('users', [])

    if not Group.exists(name=name):
        group = self.add(name=name, user_ids=user_ids)

        @request.after
        def after(response):
            response.status = 201

        return {
            '@id': request.class_link(Group, variables={'id': group.id}),
            '@type': request.class_link(GroupCollection)
        }

    else:
        @request.after
        def after(response):
            response.status = 409

        return {
            'validationError': 'Group already exists'
        }


@App.json(model=Group, request_method='PUT', load=group_validator)
def group_update(self, request, json):
    self.update(json)


@App.json(model=Group, request_method='DELETE')
def group_remove(self, request):
    self.remove()


@App.json(model=ConfirmEmail)
def confirm_email(self, request):
    user = User[self.id]
    base_url = request.host_url
    token_service = request.app.service(name='token')
    if user.email_confirmed:
        path = '/login'
        flash = 'Your email is already confirmed. Please log in.'
        flash_type = 'info'
    else:
        if token_service.validate(self.token, 'email-confirmation-salt'):
            path = '/'
            user.email_confirmed = True
            flash = 'Thank you for confirming your email address'
            flash_type = 'success'
        else:
            path = '/register'
            flash = 'The confirmation link is invalid or has been expired'
            flash_type = 'error'

    flash_encoded = urlsafe_b64encode(
        flash.encode('utf-8')
    ).replace(b'=', b'').decode('utf-8')

    query = '?flash=' + flash_encoded + '&flashtype=' + flash_type
    return redirect(base_url + path + query)


@App.json(model=SendResetEmail, request_method='POST',
          load=send_reset_email_validator)
def send_reset_email(self, request, json):
    email = json['email']
    user = User.get(email=email)
    if user:
        if user.email_confirmed:
            mailer = request.app.service(name='mailer')
            mailer.send_reset_email(user, request)

            return

        else:
            @request.after
            def email_not_confirmed(response):
                response.status_code = 403

            return {
                'validationError': 'Your email must be confirmed before ' +
                                   'resetting the password.'
            }

    else:
        @request.after
        def credentials_not_valid(response):
            response.status_code = 403

        return {'validationError': 'Email not found'}


@App.json(model=ResetPassword)
def request_reset_password(self, request):
    user = User[self.id]
    base_url = request.host_url
    query = ''
    token_service = request.app.service(name='token')
    token_valid = token_service.validate(self.token, 'password-reset-salt')

    if token_valid and user.email_confirmed:
        path = '/newpassword'
        query_dict = {
            '@id': request.class_link(ResetPassword, variables={
                'id': self.id,
                'token': self.token
            })
        }
        query = '?' + urlencode(query_dict)

    elif not token_valid:
        path = '/login'
        flash = 'The password reset link is invalid or has been expired'
        flash_encoded = urlsafe_b64encode(
            flash.encode('utf-8')
        ).replace(b'=', b'').decode('utf-8')
        query = '?flash=' + flash_encoded + '&flashtype=error'

    else:
        path = '/login'
        flash = 'Your email must be confirmed before resetting the password'
        flash_encoded = urlsafe_b64encode(
            flash.encode('utf-8')
        ).replace(b'=', b'').decode('utf-8')
        query = '?flash=' + flash_encoded + '&flashtype=error'

    return redirect(base_url + path + query)


@App.json(model=ResetPassword, request_method='PUT',
          load=reset_password_validator)
def reset_password(self, request, json):
    user = User[self.id]
    token_service = request.app.service(name='token')
    token_valid = token_service.validate(self.token, 'password-reset-salt')
    if token_valid and user.email_confirmed:
        self.update(json['password'])

    elif not token_valid:
            @request.after
            def email_not_confirmed(response):
                response.status_code = 403

            return {
                'validationError':
                    'The password reset link is invalid or has been expired'
            }

    else:
            @request.after
            def email_not_confirmed(response):
                response.status_code = 403

            return {
                'validationError': 'Your email must be confirmed ' +
                                   'before resetting the password'
            }
