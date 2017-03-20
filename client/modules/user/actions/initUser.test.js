import test from 'ava'
import {runAction} from 'cerebral/test'
import initUser from './initUser'

test('should initialize user state', t => {
  const jwtHeader = ('JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0' +
    'ODg3ODc4MjUuMCwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJsYW5ndWFnZSI6IiIsIml' +
    'zQWRtaW4iOnRydWUsInJlZnJlc2hfdW50aWwiOjE0ODg3ODYzMjUsIm5vbmNlIjoiMWM5ZT' +
    'FkMDExYWY5NDc1M2JhYjY0NDdkMjc0Y2VhMTAiLCJuaWNrbmFtZSI6IkFkbWluIn0.YAyFZ' +
    'aiJVw1FM2thGcVw97N_jMkk1ovNUjYkwYYfC7U')

  return runAction(initUser, {
    state: {
      user: {
        email: '',
        nickname: '',
        language: '',
        isAdmin: false,
        isLoggedIn: false,
        token: {},
        api: {}
      }
    },
    props: {
      headers: {
        authorization: jwtHeader
      },
      result: {
        '@id': '/users/1',
        '@type': '/users'
      }
    }
  })
  .then(({state}) => [
    t.true(state.user.isLoggedIn),
    t.is(state.user.api['@id'], '/users/1'),
    t.is(state.user.api['@type'], '/users'),
    t.is(state.user.email, 'admin@example.com'),
    t.is(state.user.nickname, 'Admin'),
    t.is(state.user.language, ''),
    t.true(state.user.isAdmin),
    t.is(localStorage.getItem('jwtHeader'), '"' + jwtHeader + '"')
  ])
})
