import HttpProvider from '@cerebral/http'
import StorageModule from '@cerebral/storage'
import { runAction } from 'cerebral/test'

import * as actions from './actions'

test('should initialize user state', () => {
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
    expect(state.user.authenticated).toBe(true),
    expect(state.user.api['@id']).toBe('/users/1'),
    expect(state.user.email).toBe('test@example.com'),
    expect(state.user.nickname).toBe('Tester'),
    expect(state.user.isAdmin).toBe(false),
    expect(localStorage.getItem('jwtHeader')).toBe(
      '"' + authHeader.validJwt + '"'
    ),
  ])
})

test('should initialize app state when no exp claim', () => {
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
    expect(state.user.authenticated).toBe(true),
    expect(state.user.api['@id']).toBe('/users/1'),
    expect(state.user.email).toBe('test@example.com'),
    expect(state.user.nickname).toBe('Tester'),
    expect(state.user.isAdmin).toBe(false),
    expect(localStorage.getItem('jwtHeader')).toBe(
      '"' + authHeader.userJwt + '"'
    ),
  ])
})

test('should initialize app state when exp claim is valid', () => {
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
    expect(state.user.authenticated).toBe(true),
    expect(state.user.api['@id']).toBe('/users/1'),
    expect(state.user.email).toBe('test@example.com'),
    expect(state.user.nickname).toBe('Tester'),
    expect(state.user.isAdmin).toBe(false),
    expect(state.user.token.exp).toBe(1000000000000),
    expect(state.user.token.refreshUntil).toBe(1000000010000),
    expect(localStorage.getItem('jwtHeader')).toBe(
      '"' + authHeader.validJwt + '"'
    ),
  ])
})

test('should fail initialize app state when token and refreshUntil expired', () => {
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
    expect(state.user.authenticated).toBe(false),
    expect(localStorage.getItem('jwtHeader')).toBe(null),
  ])
})
