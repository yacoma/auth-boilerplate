import uuid from 'uuid'
import mock from 'xhr-mock'
import StorageModule from '@cerebral/storage'
import HttpProvider from '@cerebral/http'
import { runSignal } from 'cerebral/test'

import * as sequences from './sequences'

let cerebral

beforeEach(() => {
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

test('should fetch users', async () => {
  expect.assertions(8)

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

  await runSignal(sequences.fetchUsers, cerebral).then(({ state }) => [
    expect(state.admin.pages).toBe(5),
    expect(state.admin.users[Object.keys(state.admin.users)[0]].orderKey).toBe(
      1
    ),
    expect(state.admin.users[Object.keys(state.admin.users)[0]]['@id']).toBe(
      '/users/1'
    ),
    expect(state.admin.users[Object.keys(state.admin.users)[0]].nickname).toBe(
      'Leader'
    ),
    expect(state.admin.users[Object.keys(state.admin.users)[0]].email).toBe(
      'leader@example.com'
    ),
    expect(
      state.admin.users[Object.keys(state.admin.users)[0]].emailConfirmed
    ).toBe(false),
    expect(state.admin.users[Object.keys(state.admin.users)[0]].isAdmin).toBe(
      true
    ),
    expect(
      state.admin.users[Object.keys(state.admin.users)[0]].registerIP
    ).toBe(''),
  ])
})

test('should update existing user', async () => {
  expect.assertions(8)

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

  await runSignal(sequences.fetchUsers, cerebral).then(({ state }) => [
    expect(state.admin.pages).toBe(15),
    expect(state.admin.users.testuid000.orderKey).toBe(1),
    expect(state.admin.users.testuid000['@id']).toBe('/users/1'),
    expect(state.admin.users.testuid000.nickname).toBe('Leader'),
    expect(state.admin.users.testuid000.email).toBe('leader@example.com'),
    expect(state.admin.users.testuid000.emailConfirmed).toBe(false),
    expect(state.admin.users.testuid000.isAdmin).toBe(true),
    expect(state.admin.users.testuid000.registerIP).toBe(''),
  ])
})

test('should return noUsersFound', async () => {
  expect.assertions(1)

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

  await runSignal(sequences.fetchUsers, cerebral, {
    recordActions: 'byName',
  }).then(({ mergeUsers }) => [
    expect(mergeUsers.output.noUsersFound).toBe(true),
  ])
})
