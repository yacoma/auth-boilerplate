import json
from pony.orm import db_session
from webtest import TestApp as Client

import morepath
from .utils import assert_dict_contains_subset

import server
from server import TestApp as App
from server.model import db, User, Group


def setup_module(module):
    morepath.scan(server)
    morepath.commit(App)


def setup_function(function):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()

    with db_session:
        editor = Group(id=3, name='Editor')
        moderator = Group(id=2, name='Moderator', basegroups=[editor])
        admin = Group(id=1, name='Admin', basegroups=[moderator, editor])

        User(id=1, nickname='Leader', email='leader@example.com',
             password='test1', groups=[admin])
        User(id=2, nickname='Mary', email='mary@example.com',
             password='test2', groups=[moderator])
        User(id=3, nickname='Mike', email='mike@example.com',
             password='test3', groups=[editor])


def test_group():
    c = Client(App())
    response = c.get('/groups/1')
    group = {
        "@id": "/groups/1",
        "@type": "/groups",
        "name": "Admin",
        "subgroups": ["Admin"],
        "users": ["Leader"]
    }
    assert_dict_contains_subset(group, response.json)


def test_recursive_groups():
    with db_session:

        leader = User.get(nickname='Leader')  # Admin
        mary = User.get(nickname='Mary')  # Moderator
        mike = User.get(nickname='Mike')  # Editor

        editor = Group.get(name='Editor')
        moderator = Group.get(name='Moderator')  # has also Editor permissions
        admin = Group.get(name='Admin')  # also Moderator and Editor

        assert editor in leader.groups.basegroups
        assert leader in editor.subgroups.users
        assert moderator in leader.groups.basegroups
        assert leader in moderator.subgroups.users
        assert admin in leader.groups.basegroups
        assert leader in admin.subgroups.users

        assert editor in mary.groups.basegroups
        assert mary in editor.subgroups.users
        assert moderator in mary.groups.basegroups
        assert mary in moderator.subgroups.users
        assert admin not in mary.groups.basegroups
        assert mary not in admin.subgroups.users

        assert editor in mike.groups.basegroups
        assert mike in editor.subgroups.users
        assert moderator not in mike.groups.basegroups
        assert mike not in moderator.subgroups.users
        assert admin not in mike.groups.basegroups
        assert mike not in admin.subgroups.users


def test_add_group():
    c = Client(App())

    new_group_json = json.dumps({"name": "NewGroup"})

    response = c.post('/groups', new_group_json, status=201)
    assert response.json == {
        "@id": "/groups/4",
        "@type": "/groups"
    }
    with db_session:
        assert Group.exists(name='NewGroup')

    response = c.post('/groups', new_group_json, status=409)
    assert response.json == {
        "validationError": "Group already exists"
    }

    with db_session:
        editor_id = Group.get(name='Editor').get_pk()
        with_basegroup_json = json.dumps({
            "name": "SubGroup",
            "basegroups": [editor_id]
        })
        c.post('/groups', with_basegroup_json)

        assert Group.exists(name='SubGroup')
        assert Group.get(name='Editor') \
            in Group.get(name='SubGroup').basegroups


def test_update_group():
    c = Client(App())

    updateted_group_json = json.dumps({"name": "Guru"})
    c.put('/groups/1', updateted_group_json)

    with db_session:
        assert Group[1].name == "Guru"

        moderator_id = Group.get(name='Moderator').get_pk()
        updateted_group_json = json.dumps({"basegroups": [moderator_id]})
        c.put('/groups/3', updateted_group_json)

        g = Group[3]
        editor = Group.get(name='Editor')
        moderator = Group.get(name='Moderator')

        assert editor in g.basegroups
        assert moderator in g.basegroups

        updateted_group_json = json.dumps({"subgroups": [moderator_id]})
        c.put('/groups/1', updateted_group_json)

        g = Group[1]
        moderator = Group.get(name='Moderator')

        assert moderator in g.subgroups


def test_delete_group():
    c = Client(App())

    with db_session:
        assert Group.exists(name='Moderator')

    c.delete('/groups/2')

    with db_session:
        assert not Group.exists(name='Moderator')
