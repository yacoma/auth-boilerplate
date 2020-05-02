import json

from argon2 import PasswordHasher
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

    ph = PasswordHasher()

    with db_session:
        editor = Group(id=3, name="Editor")
        moderator = Group(id=2, name="Moderator")
        admin = Group(id=1, name="Admin")

        User(
            id=1,
            nickname="Leader",
            email="leader@example.com",
            password=ph.hash("test1"),
            groups=[admin],
        )
        User(
            id=2,
            nickname="Mary",
            email="mary@example.com",
            password=ph.hash("test2"),
            groups=[moderator],
        )
        User(
            id=3,
            nickname="Mike",
            email="mike@example.com",
            password=ph.hash("test3"),
            groups=[editor],
        )


def test_group():
    c = Client(App())
    response = c.get("/groups/1")
    group = {"@id": "/groups/1", "name": "Admin", "users": ["leader@example.com"]}
    assert_dict_contains_subset(group, response.json)


def test_groups_collection():
    c = Client(App())

    response = c.post(
        "/login", json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {"Authorization": response.headers["Authorization"]}

    response = c.get("/groups", headers=headers)
    group_1 = {"@id": "/groups/1", "name": "Admin", "users": ["leader@example.com"]}
    assert_dict_contains_subset(group_1, response.json["groups"][0])


def test_add_group():
    c = Client(App())

    response = c.post(
        "/login", json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {"Authorization": response.headers["Authorization"]}

    new_group_json = json.dumps({"name": "NewGroup"})

    response = c.post("/groups", new_group_json, headers=headers, status=201)
    assert response.json == {"@id": "/groups/4"}
    with db_session:
        assert Group.exists(name="NewGroup")

    response = c.post("/groups", new_group_json, headers=headers, status=409)
    assert response.json == {"validationError": "Group already exists"}

    with_users_json = json.dumps(
        {
            "name": "UserGroup",
            "users": ["leader@example.com", "mary@example.com", "mike@example.com"],
        }
    )
    c.post("/groups", with_users_json, headers=headers)

    with db_session:
        assert Group.exists(name="UserGroup")
        assert User[1] in Group.get(name="UserGroup").users
        assert User[2] in Group.get(name="UserGroup").users
        assert User[3] in Group.get(name="UserGroup").users


def test_update_group():
    c = Client(App())

    response = c.post(
        "/login", json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {"Authorization": response.headers["Authorization"]}

    updateted_group_json = json.dumps(
        {"users": ["mary@example.com", "mike@example.com"]}
    )
    c.put("/groups/3", updateted_group_json, headers=headers)

    with db_session:
        g = Group[3]
        assert User[2] in g.users
        assert User[3] in g.users

    updateted_group_json = json.dumps({"name": "Moderator"})
    response = c.put("/groups/1", updateted_group_json, headers=headers, status=409)
    assert response.json == {"validationError": "Group already exists"}

    updateted_group_json = json.dumps({"name": "Guru"})
    c.put("/groups/1", updateted_group_json, headers=headers)

    with db_session:
        assert Group[1].name == "Guru"


def test_delete_group():
    c = Client(App())

    response = c.post(
        "/login", json.dumps({"email": "leader@example.com", "password": "test1"})
    )

    headers = {"Authorization": response.headers["Authorization"]}

    with db_session:
        assert Group.exists(name="Moderator")

    c.delete("/groups/2", headers=headers)

    with db_session:
        assert not Group.exists(name="Moderator")
