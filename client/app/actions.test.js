import test from 'ava'
import HttpProvider from '@cerebral/http'
import StorageModule from '@cerebral/storage'
import { runAction } from 'cerebral/test'

import { authHeader } from './test_constants'
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

test.serial('should initialize app state when no exp claim', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(authHeader.userJwt))

  return runAction(actions.initApp, {
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
    modules: { storage: StorageModule({ target: localStorage }) },
  }).then(({ state }) => [
    t.true(state.user.authenticated),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.email, 'test@example.com'),
    t.is(state.user.nickname, 'Tester'),
    t.false(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), '"' + authHeader.userJwt + '"'),
  ])
})

test.serial('should initialize app state when exp claim is valid', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(authHeader.validJwt))

  return runAction(actions.initApp, {
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
    modules: { storage: StorageModule({ target: localStorage }) },
  }).then(({ state }) => [
    t.true(state.user.authenticated),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.email, 'test@example.com'),
    t.is(state.user.nickname, 'Tester'),
    t.false(state.user.isAdmin),
    t.is(state.user.token.exp, 1000000000000),
    t.is(state.user.token.refreshUntil, 1000000010000),
    t.is(localStorage.getItem('jwtHeader'), '"' + authHeader.validJwt + '"'),
  ])
})

test.serial(
  'should fail initialize app state when token and refreshUntil expired',
  t => {
    localStorage.setItem('jwtHeader', JSON.stringify(authHeader.expiredJwt))

    return runAction(actions.initApp, {
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
      modules: { storage: StorageModule({ target: localStorage }) },
    }).then(({ state }) => [
      t.false(state.user.authenticated),
      t.is(localStorage.getItem('jwtHeader'), null),
    ])
  }
)
