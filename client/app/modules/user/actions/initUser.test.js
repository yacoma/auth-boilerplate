import test from 'ava'
import HttpProvider from '@cerebral/http'
import StorageModule from '@cerebral/storage'
import { runAction } from 'cerebral/test'

import { validJwtHeader } from '../../../test_constants'
import initUser from './initUser'

test('should initialize user state', t => {
  return runAction(initUser, {
    state: {
      user: {
        email: '',
        nickname: '',
        isAdmin: false,
        authenticated: false,
        token: {},
        api: {},
      },
    },
    props: {
      response: {
        headers: {
          authorization: validJwtHeader,
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
          Authorization: validJwtHeader,
        },
      }),
    },
  }).then(({ state }) => [
    t.true(state.user.authenticated),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.email, 'test@example.com'),
    t.is(state.user.nickname, 'Tester'),
    t.false(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), '"' + validJwtHeader + '"'),
  ])
})
