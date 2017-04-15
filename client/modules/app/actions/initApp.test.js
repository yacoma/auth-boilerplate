import test from 'ava'
import StorageProvider from 'cerebral-provider-storage'
import {runAction} from 'cerebral/test'
import initApp from './initApp'

test.serial('should initialize app state', t => {
  let jwtHeader = (
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
    'Im5pY2tuYW1lIjoiQWRtaW4iLCJub25jZSI6IjkxZTc4N2Y4YWU5ZTRhNmE5ZTMzN' +
    'zU1MzFjYWU0OWFjIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpc0FkbWluIj' +
    'p0cnVlfQ.anr0ZkRErPzXT0DAhLjSegaC9vpK7u2FgqETzEg-h-A'
  )

  localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))

  return runAction(initApp, {
    state: {
      user: {
        email: '',
        nickname: '',
        isAdmin: false,
        autenticated: false,
        token: {},
        api: {}
      }
    },
    providers: [
      StorageProvider({target: localStorage})
    ]
  })
  .then(({state}) => [
    t.true(state.user.autenticated),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.email, 'admin@example.com'),
    t.is(state.user.nickname, 'Admin'),
    t.true(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), '"' + jwtHeader + '"')
  ])
})

test.serial('should fail initialize app state when token and refreshUntil expired', t => {
  let jwtHeader = (
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
    'Im5pY2tuYW1lIjoiQWRtaW4iLCJub25jZSI6IjkxZTc4N2Y4YWU5ZTRhNmE5ZTMzN' +
    'zU1MzFjYWU0OWFjIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJleHAiOjE0OT' +
    'A5MDAwMDAsInJlZnJlc2hfdW50aWwiOjE0OTA5NjkxNzksImlzQWRtaW4iOnRydWV' +
    '9.GvXTpoijc5Sy9oyht6AcfdN8kPmzkDKTmSYu17D9wKk'
  )

  localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))

  return runAction(initApp, {
    state: {
      user: {
        email: '',
        nickname: '',
        isAdmin: false,
        autenticated: false,
        token: {},
        api: {}
      }
    },
    providers: [
      StorageProvider({target: localStorage})
    ]
  })
  .then(({state}) => [
    t.false(state.user.autenticated),
    t.is(localStorage.getItem('jwtHeader'), null)
  ])
})
