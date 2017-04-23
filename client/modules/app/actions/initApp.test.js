import test from 'ava'
import StorageProvider from 'cerebral-provider-storage'
import {runAction} from 'cerebral/test'
import initApp from './initApp'

test.serial('should initialize app state when no exp claim', t => {
  let jwtHeader =
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
    'Im5pY2tuYW1lIjoiQWRtaW4iLCJub25jZSI6IjkxZTc4N2Y4YWU5ZTRhNmE5ZTMzN' +
    'zU1MzFjYWU0OWFjIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpc0FkbWluIj' +
    'p0cnVlfQ.anr0ZkRErPzXT0DAhLjSegaC9vpK7u2FgqETzEg-h-A'

  localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))

  return runAction(initApp, {
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
    providers: [StorageProvider({target: localStorage})],
  }).then(({state}) => [
    t.true(state.user.authenticated),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.email, 'admin@example.com'),
    t.is(state.user.nickname, 'Admin'),
    t.true(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), '"' + jwtHeader + '"'),
  ])
})

test.serial('should initialize app state when exp claim is valid', t => {
  let jwtHeader =
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
    'Im5pY2tuYW1lIjoiQWRtaW4iLCJleHAiOjEwMDAwMDAwMDAwMDAsInJlZnJlc2hfd' +
    'W50aWwiOjEwMDAwMDAwMTAwMDAsIm5vbmNlIjoiOTFlNzg3ZjhhZTllNGE2YTllMz' +
    'M3NTUzMWNhZTQ5YWMiLCJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsImlzQWRtaW4' +
    'iOnRydWV9.mR0G9PINNBdBdThiDSnD5Vr7QeKxLMRuUuFIjHldUj4'

  localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))

  return runAction(initApp, {
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
    providers: [StorageProvider({target: localStorage})],
  }).then(({state}) => [
    t.true(state.user.authenticated),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.email, 'admin@example.com'),
    t.is(state.user.nickname, 'Admin'),
    t.true(state.user.isAdmin),
    t.is(state.user.token.exp, 1000000000000),
    t.is(state.user.token.refreshUntil, 1000000010000),
    t.is(localStorage.getItem('jwtHeader'), '"' + jwtHeader + '"'),
  ])
})

test.serial(
  'should fail initialize app state when token and refreshUntil expired',
  t => {
    let jwtHeader =
      'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
      'Im5pY2tuYW1lIjoiQWRtaW4iLCJub25jZSI6IjkxZTc4N2Y4YWU5ZTRhNmE5ZTMzN' +
      'zU1MzFjYWU0OWFjIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJleHAiOjE0OT' +
      'A5MDAwMDAsInJlZnJlc2hfdW50aWwiOjE0OTA5NjkxNzksImlzQWRtaW4iOnRydWV' +
      '9.GvXTpoijc5Sy9oyht6AcfdN8kPmzkDKTmSYu17D9wKk'

    localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))

    return runAction(initApp, {
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
      providers: [StorageProvider({target: localStorage})],
    }).then(({state}) => [
      t.false(state.user.authenticated),
      t.is(localStorage.getItem('jwtHeader'), null),
    ])
  }
)
