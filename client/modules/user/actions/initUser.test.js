import t from 'tap'
import {runAction} from 'cerebral/test'
import initUser from './initUser'

t.test('should initialize user state', t => {
  const fixtureState = {
    user: {
      email: '',
      nickname: '',
      language: '',
      isAdmin: false,
      isLoggedIn: false,
      token: {},
      api: {}
    }
  }

  const fixtureProps = {
    headers: {
      authorization: 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODg3ODc4MjUuMCwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJsYW5ndWFnZSI6IiIsImlzQWRtaW4iOnRydWUsInJlZnJlc2hfdW50aWwiOjE0ODg3ODYzMjUsIm5vbmNlIjoiMWM5ZTFkMDExYWY5NDc1M2JhYjY0NDdkMjc0Y2VhMTAiLCJuaWNrbmFtZSI6IkFkbWluIn0.YAyFZaiJVw1FM2thGcVw97N_jMkk1ovNUjYkwYYfC7U'
    },
    result: {
      '@id': '/users/1',
      '@type': '/users'
    }
  }

  return runAction(initUser, {
    state: fixtureState,
    props: fixtureProps
  })
  .then(({state}) => [
    t.equal(state.user.isLoggedIn, true),
    t.equal(state.user.api['@id'], '/users/1'),
    t.equal(state.user.api['@type'], '/users'),
    t.equal(state.user.email, 'admin@example.com'),
    t.equal(state.user.nickname, 'Admin'),
    t.equal(state.user.language, ''),
    t.equal(state.user.isAdmin, true)
  ])
})
