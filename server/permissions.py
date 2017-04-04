from .app import App
from .model import User, Group


class ViewPermission(object):
    pass


class EditPermission(object):
    pass


@App.permission_rule(model=object, permission=object)
def admin_has_global_permission(identity, model, permission):
    user = User.get(email=identity.userid)
    return Group.get(name='Admin') in user.groups


@App.permission_rule(model=User, permission=object)
def user_has_self_permission(identity, model, permission):
    user = User.get(email=identity.userid)
    if user is not None and Group.get(name='Admin') in user.groups:
        return True
    else:
        return model.email == identity.userid
