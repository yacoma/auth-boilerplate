from .app import App
from .model import User, Group, ResetNonce


class ViewPermission:
    pass


class EditPermission:
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


@App.permission_rule(model=ResetNonce, permission=EditPermission)
def user_has_permission_to_reset_nonce(identity, model, permission):
    user = User.get(email=identity.userid)
    if user is not None and Group.get(name='Admin') in user.groups:
        return True
    else:
        return user.id == int(model.id)
