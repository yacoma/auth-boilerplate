import test from 'ava'
import HttpProvider from '@cerebral/http'
import StorageProvider from '@cerebral/storage'
import {runAction} from 'cerebral/test'
import initUser from './initUser'

test('should initialize user state', t => {
  const jwtHeader =
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
    'Im5pY2tuYW1lIjoiQWRtaW4iLCJub25jZSI6IjkxZTc4N2Y4YWU5ZTRhNmE5ZTMzN' +
    'zU1MzFjYWU0OWFjIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJleHAiOjE0OT' +
    'A5MDAwMDAsInJlZnJlc2hfdW50aWwiOjE0OTA5NjkxNzksImlzQWRtaW4iOnRydWV' +
    '9.GvXTpoijc5Sy9oyht6AcfdN8kPmzkDKTmSYu17D9wKk'

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
      headers: {
        authorization: jwtHeader,
      },
    },
    providers: [
      HttpProvider({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Accept: 'application/json',
          Authorization: jwtHeader,
        },
      }),
      StorageProvider({target: localStorage}),
    ],
  }).then(({state}) => [
    t.true(state.user.authenticated),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.email, 'admin@example.com'),
    t.is(state.user.nickname, 'Admin'),
    t.true(state.user.isAdmin),
    t.truthy(state.user.token.exp),
    t.truthy(state.user.token.refreshUntil),
    t.is(localStorage.getItem('jwtHeader'), '"' + jwtHeader + '"'),
  ])
})
