import json

import morepath
from pony.orm import db_session
from webtest import TestApp as Client

import server
from server import TestApp as App
from server.model import db, User, Group

from .utils import assert_dict_contains_subset


def setup_module(module):
    morepath.scan(server)
    morepath.commit(App)


def setup_function(function):
    db.drop_all_tables(with_all_data=True)
    db.create_tables()

    with db_session:
        editor = Group(id=3, name='Editor')
        moderator = Group(id=2, name='Moderator')
        admin = Group(id=1, name='Admin')

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
        "users": ["leader@example.com"]
    }
    assert_dict_contains_subset(group, response.json)


def test_groups_collection():
    c = Client(App())
    response = c.get('/groups')
    group_1 = {
        "@id": "/groups/1",
        "@type": "/groups",
        "name": "Admin",
        "users": ["leader@example.com"]
    }
    assert_dict_contains_subset(group_1, response.json['groups'][0])


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

    with_users_json = json.dumps({
        "name": "UserGroup",
        "users": [1, 2, 3]
    })
    c.post('/groups', with_users_json)

    with db_session:
        assert Group.exists(name='UserGroup')
        assert User[1] in Group.get(name='UserGroup').users
        assert User[2] in Group.get(name='UserGroup').users
        assert User[3] in Group.get(name='UserGroup').users


def test_update_group():
    c = Client(App())

    updateted_group_json = json.dumps({"name": "Guru"})
    c.put('/groups/1', updateted_group_json)

    with db_session:
        assert Group[1].name == "Guru"

        updateted_group_json = json.dumps({"users": [2, 3]})
        c.put('/groups/1', updateted_group_json)

        g = Group[1]
        assert User[2] in g.users
        assert User[3] in g.users


def test_delete_group():
    c = Client(App())

    with db_session:
        assert Group.exists(name='Moderator')

    c.delete('/groups/2')

    with db_session:
        assert not Group.exists(name='Moderator')
