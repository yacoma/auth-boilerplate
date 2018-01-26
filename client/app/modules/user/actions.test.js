import test from 'ava'
import HttpProvider from '@cerebral/http'
import StorageModule from '@cerebral/storage'
import { runAction } from 'cerebral/test'

import { authHeader } from '../../test_constants'
import * as actions from './actions'

test.serial('should initialize user state', t => {
  return runAction(actions.initUser, {
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
          authorization: authHeader.validJwt,
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
          Authorization: authHeader.validJwt,
        },
      }),
    },
  }).then(({ state }) => [
    t.true(state.user.authenticated),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.email, 'test@example.com'),
    t.is(state.user.nickname, 'Tester'),
    t.false(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), '"' + authHeader.validJwt + '"'),
  ])
})

test.serial('should remove user state', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(authHeader.validJwt))

  return runAction(actions.removeUser, {
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
          Authorization: authHeader.validJwt,
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
