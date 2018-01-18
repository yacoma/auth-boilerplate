import test from 'ava'
import StorageModule from '@cerebral/storage'
import { runAction } from 'cerebral/test'

import * as constants from './test_constants'
import * as actions from './actions'

test.serial('should initialize app state when no exp claim', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(constants.userJwtHeader))

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
    t.is(
      localStorage.getItem('jwtHeader'),
      '"' + constants.userJwtHeader + '"'
    ),
  ])
})

test.serial('should initialize app state when exp claim is valid', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(constants.validJwtHeader))

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
    t.is(
      localStorage.getItem('jwtHeader'),
      '"' + constants.validJwtHeader + '"'
    ),
  ])
})

test.serial(
  'should fail initialize app state when token and refreshUntil expired',
  t => {
    localStorage.setItem(
      'jwtHeader',
      JSON.stringify(constants.expiredJwtHeader)
    )

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
