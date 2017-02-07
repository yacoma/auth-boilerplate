from .app import App
from .collection import UserCollection, GroupCollection
from .model import Root, Login, User, Group, ConfirmEmail, ResetPassword


@App.path(model=Root, path='/')
def get_root():
    return Root()


@App.path(model=Login, path='login')
def get_login():
    return Login()


@App.path(model=User, path='users/{id}')
def get_user(id):
    return User[id]


@App.path(model=ConfirmEmail, path='users/{id}/confirm/{token}')
def get_confirm_email(id, token):
    return ConfirmEmail(id, token)


@App.path(model=ResetPassword, path='users/{id}/reset/{token}')
def get_reset_password(id, token):
    return ResetPassword(id, token)


@App.path(model=UserCollection, path='users')
def get_user_collection():
    return UserCollection()


@App.path(model=Group, path='groups/{id}')
def get_group(id):
    return Group[id]


@App.path(model=GroupCollection, path='groups')
def get_group_collection():
    return GroupCollection()
