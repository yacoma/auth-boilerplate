import test from 'ava'
import uuid from 'uuid'
import mock from 'xhr-mock'
import StorageModule from '@cerebral/storage'
import HttpProvider from '@cerebral/http'
import { runSignal } from 'cerebral/test'

import { authHeader } from '../../test_constants'
import * as sequences from './sequences'

let cerebral

test.beforeEach(t => {
  mock.setup()
  cerebral = {
    state: {
      admin: {
        users: {},
        usersSortBy: 'email',
        usersSortDir: 'descending',
        searchString: 'leader',
        searchIsLoading: false,
        currentPage: 5,
        pages: 1,
        pageSize: 30,
      },
    },
    modules: {
      storage: StorageModule({ target: localStorage }),
    },
    providers: {
      uuid,
      http: HttpProvider({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Accept: 'application/json',
          Authorization: authHeader.userJwt,
        },
      }),
    },
  }
})

test.serial('should fetch users', t => {
  mock.get(/\/api\/users.*/, (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .body(
        JSON.stringify({
          pages: 5,
          users: [
            {
              '@id': '/users/1',
              nickname: 'Leader',
              email: 'leader@example.com',
              emailConfirmed: false,
              isAdmin: true,
              registerIP: '',
            },
          ],
        })
      )
  })

  return runSignal(sequences.fetchUsers, cerebral).then(({ state }) => [
    t.is(state.admin.pages, 5),
    t.is(state.admin.users[Object.keys(state.admin.users)[0]]['orderKey'], 1),
    t.is(
      state.admin.users[Object.keys(state.admin.users)[0]]['@id'],
      '/users/1'
    ),
    t.is(
      state.admin.users[Object.keys(state.admin.users)[0]]['nickname'],
      'Leader'
    ),
    t.is(
      state.admin.users[Object.keys(state.admin.users)[0]]['email'],
      'leader@example.com'
    ),
    t.is(
      state.admin.users[Object.keys(state.admin.users)[0]]['emailConfirmed'],
      false
    ),
    t.is(state.admin.users[Object.keys(state.admin.users)[0]]['isAdmin'], true),
    t.is(
      state.admin.users[Object.keys(state.admin.users)[0]]['registerIP'],
      ''
    ),
  ])
})

test.serial('should update existing user', t => {
  Object.assign(cerebral, {
    state: {
      admin: {
        users: {
          testuid000: {
            email: 'leader@example.com',
            isAdmin: false,
          },
        },
      },
    },
  })

  mock.get(/\/api\/users.*/, (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .body(
        JSON.stringify({
          pages: 15,
          users: [
            {
              '@id': '/users/1',
              nickname: 'Leader',
              email: 'leader@example.com',
              emailConfirmed: false,
              isAdmin: true,
              registerIP: '',
            },
          ],
        })
      )
  })

  return runSignal(sequences.fetchUsers, cerebral).then(({ state }) => [
    t.is(state.admin.pages, 15),
    t.is(state.admin.users.testuid000.orderKey, 1),
    t.is(state.admin.users.testuid000['@id'], '/users/1'),
    t.is(state.admin.users.testuid000.nickname, 'Leader'),
    t.is(state.admin.users.testuid000.email, 'leader@example.com'),
    t.is(state.admin.users.testuid000.emailConfirmed, false),
    t.is(state.admin.users.testuid000.isAdmin, true),
    t.is(state.admin.users.testuid000.registerIP, ''),
  ])
})

test.serial('should return noUsersFound', t => {
  mock.get(/\/api\/users.*/, (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .body(
        JSON.stringify({
          users: [],
        })
      )
  })

  return runSignal(sequences.fetchUsers, cerebral, {
    recordActions: 'byName',
  }).then(({ mergeUsers }) => [t.true(mergeUsers.output.noUsersFound)])
})
