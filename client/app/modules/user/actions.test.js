import HttpProvider from '@cerebral/http'
import StorageModule from '@cerebral/storage'
import { runAction } from 'cerebral/test'

import * as actions from './actions'

test('should remove user state', () => {
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
    expect(state.user.authenticated).toBe(false),
    expect(state.user.api).toEqual({}),
    expect(state.user.token).toEqual({}),
    expect(state.user.email).toBe(''),
    expect(state.user.nickname).toBe(''),
    expect(state.user.isAdmin).toBe(false),
    expect(localStorage.getItem('jwtHeader')).toBe(null),
  ])
})
