import test from 'ava'
import HttpProvider from '@cerebral/http'
import StorageModule from '@cerebral/storage'
import { runAction } from 'cerebral/test'

import { userJwtHeader } from '../../../test_constants'
import removeUser from './removeUser'

test('should remove user state', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(userJwtHeader))

  return runAction(removeUser, {
    state: {
      user: {
        email: 'test@example.com',
        nickname: 'Tester',
        isAdmin: false,
        authenticated: true,
        token: {},
        api: {
          '@id': '/users/1',
        },
      },
    },
    modules: { storage: StorageModule({ target: localStorage }) },
    providers: {
      http: HttpProvider({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Accept: 'application/json',
          Authorization: userJwtHeader,
        },
      }),
    },
  }).then(({ state }) => [
    t.false(state.user.authenticated),
    t.deepEqual(state.user.api, {}),
    t.deepEqual(state.user.token, {}),
    t.is(state.user.email, ''),
    t.is(state.user.nickname, ''),
    t.false(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), null),
  ])
})
