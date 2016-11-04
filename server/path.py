from .app import App
from .collection import UserCollection, GroupCollection
from .model import Root, Login, User, Group


@App.path(model=Root, path='/')
def get_root():
    return Root()


@App.path(model=Login, path='login')
def get_login():
    return Login()


@App.path(model=User, path='users/{id}')
def get_user(request, id):
    return User[id]


@App.path(model=UserCollection, path='users')
def get_user_collection(request):
    return UserCollection()


@App.path(model=Group, path='groups/{id}')
def get_group(request, id):
    return Group[id]


@App.path(model=GroupCollection, path='groups')
def get_group_collection(request):
    return GroupCollection()
