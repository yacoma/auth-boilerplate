import test from 'ava'
import mock from 'xhr-mock'

import HttpProvider from 'cerebral-provider-http'
import {CerebralTest} from 'cerebral/test'

import App from '../app'
import User from '.'

const jwtHeader = ('JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0' +
  'ODg3ODc4MjUuMCwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJsYW5ndWFnZSI6IiIsIml' +
  'zQWRtaW4iOnRydWUsInJlZnJlc2hfdW50aWwiOjE0ODg3ODYzMjUsIm5vbmNlIjoiMWM5ZT' +
  'FkMDExYWY5NDc1M2JhYjY0NDdkMjc0Y2VhMTAiLCJuaWNrbmFtZSI6IkFkbWluIn0.YAyFZ' +
  'aiJVw1FM2thGcVw97N_jMkk1ovNUjYkwYYfC7U')

let cerebral

test.beforeEach(t => {
  mock.setup()
  cerebral = CerebralTest({
    modules: {
      app: App({'flash': null, 'flashType': null}),
      user: User({'@id': null})
    },
    providers: [
      HttpProvider({
        baseUrl: '/api',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': jwtHeader
        }
      })
    ]
  })
})

test.afterEach(t => {
  mock.teardown()
})

test.serial('should log in', t => {
  mock.post('/api/login', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', jwtHeader)
      .body(JSON.stringify({
        '@id': '/users/1',
        '@type': '/users'
      }))
  })

  cerebral.setState('user.signIn.email.value', 'admin@example.com')
  cerebral.setState('user.signIn.password.value', 'admin0')

  return cerebral.runSignal('user.loginFormSubmitted')
    .then(({state}) => ([
      t.true(state.user.isLoggedIn),
      t.is(state.user.api['@id'], '/users/1'),
      t.is(state.user.api['@type'], '/users'),
      t.is(state.user.email, 'admin@example.com'),
      t.is(state.user.nickname, 'Admin'),
      t.true(state.user.isAdmin),
      t.is(state.user.signIn.email.value, ''),
      t.is(state.user.signIn.password.value, ''),
      t.is(state.user.signIn.validationError, null),
      t.false(state.user.signIn.showErrors),
      t.is(localStorage.getItem('jwtHeader'), '"' + jwtHeader + '"')
    ]))
})

test.serial('should not log in when wrong password', t => {
  mock.post('/api/login', (req, res) => {
    return res
      .status(403)
      .header('Content-Type', 'application/json')
      .body(JSON.stringify({
        'validationError': 'Invalid email or password'
      }))
  })

  cerebral.setState('user.signIn.email.value', 'admin@example.com')
  cerebral.setState('user.signIn.password.value', 'wrong_password')

  return cerebral.runSignal('user.loginFormSubmitted')
    .then(({state}) => ([
      t.false(state.user.isLoggedIn),
      t.is(state.user.signIn.validationError, 'Invalid email or password'),
      t.is(state.user.signIn.email.value, 'admin@example.com'),
      t.is(state.user.signIn.password.value, '')
    ]))
})

test.serial('should not log in on server error', t => {
  mock.post('/api/login', (req, res) => {
    return res
      .status(501)
  })

  cerebral.setState('user.signIn.email.value', 'admin@example.com')
  cerebral.setState('user.signIn.password.value', 'admin0')

  return cerebral.runSignal('user.loginFormSubmitted')
    .then(({state}) => ([
      t.false(state.user.isLoggedIn),
      t.is(state.user.signIn.validationError, 'Could not log-in!'),
      t.is(state.user.signIn.email.value, 'admin@example.com'),
      t.is(state.user.signIn.password.value, '')
    ]))
})

test('should be logged out', t => {
  cerebral.setState('user.isLoggedIn', true)
  cerebral.setState('user.email', 'admin@example.com')
  cerebral.setState('user.nickname', 'Admin')
  cerebral.setState('user.isAdmin', true)

  return cerebral.runSignal('user.logoutButtonClicked')
    .then(({state}) => ([
      t.false(state.user.isLoggedIn),
      t.is(state.user.email, ''),
      t.is(state.user.nickname, ''),
      t.false(state.user.isAdmin)
    ]))
})

test.serial('should register', t => {
  mock.post('/api/users', (req, res) => {
    return res
      .status(201)
      .header('Content-Type', 'application/json')
      .body(JSON.stringify({
        '@id': '/users/1',
        '@type': '/users'
      }))
  })

  cerebral.setState('user.register.nickname.value', 'Admin')
  cerebral.setState('user.register.email.value', 'admin@example.com')
  cerebral.setState('user.register.password.value', 'admin0')
  cerebral.setState('user.register.confirmPassword.value', 'admin0')

  return cerebral.runSignal('user.registerFormSubmitted')
    .then(({state}) => ([
      t.is(state.app.currentPage, 'login'),
      t.is(state.user.register.nickname.value, ''),
      t.is(state.user.register.email.value, ''),
      t.is(state.user.register.password.value, ''),
      t.is(state.user.register.confirmPassword.value, ''),
      t.is(state.user.register.validationError, null),
      t.false(state.user.register.showErrors)
    ]))
})

test.serial('should not register when email exists', t => {
  mock.post('/api/users', (req, res) => {
    return res
      .status(409)
      .header('Content-Type', 'application/json')
      .body(JSON.stringify({
        'validationError': 'Email already exists'
      }))
  })

  cerebral.setState('user.register.nickname.value', 'Admin')
  cerebral.setState('user.register.email.value', 'admin@example.com')
  cerebral.setState('user.register.password.value', 'admin0')
  cerebral.setState('user.register.confirmPassword.value', 'admin0')

  return cerebral.runSignal('user.registerFormSubmitted')
    .then(({state}) => ([
      t.is(state.user.register.validationError, 'Email already exists'),
      t.is(state.user.register.nickname.value, 'Admin'),
      t.is(state.user.register.email.value, 'admin@example.com'),
      t.is(state.user.register.password.value, ''),
      t.is(state.user.register.confirmPassword.value, ''),
      t.false(state.user.register.showErrors)
    ]))
})

test.serial('should not register when email server does not exists', t => {
  mock.post('/api/users', (req, res) => {
    return res
      .status(422)
      .header('Content-Type', 'application/json')
      .body(JSON.stringify({
        '@id': '/users/1',
        'email': ['Email could not be delivered']
      }))
  })

  cerebral.setState('user.register.nickname.value', 'Admin')
  cerebral.setState('user.register.email.value', 'admin@example.com')
  cerebral.setState('user.register.password.value', 'admin0')
  cerebral.setState('user.register.confirmPassword.value', 'admin0')

  return cerebral.runSignal('user.registerFormSubmitted')
    .then(({state}) => ([
      t.is(state.user.register.validationError, 'email: Email could not be delivered'),
      t.is(state.user.register.nickname.value, 'Admin'),
      t.is(state.user.register.email.value, 'admin@example.com'),
      t.is(state.user.register.password.value, ''),
      t.is(state.user.register.confirmPassword.value, ''),
      t.false(state.user.register.showErrors)
    ]))
})
