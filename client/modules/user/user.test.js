import test from 'ava'
import mock from 'xhr-mock'

import HttpProvider from 'cerebral-provider-http'
import StorageProvider from 'cerebral-provider-storage'
import {CerebralTest} from 'cerebral/test'

import App from '../app'
import User from '.'

const jwtHeader = (
  'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
  'Im5pY2tuYW1lIjoiQWRtaW4iLCJsYW5ndWFnZSI6IiIsIm5vbmNlIjoiOTFlNzg3Z' +
  'jhhZTllNGE2YTllMzM3NTUzMWNhZTQ5YWMiLCJzdWIiOiJhZG1pbkBleGFtcGxlLm' +
  'NvbSIsInJlZnJlc2hfdW50aWwiOjE0OTA5NjkxNzksImlzQWRtaW4iOnRydWV9.lE' +
  'TPoIBVbyZ3XUPzGIstyzNx8SNg9SQYJNCfKFynWiA'
)

let cerebral

test.beforeEach(t => {
  localStorage.removeItem('jwtHeader')
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
      }),
      StorageProvider({target: localStorage})
    ]
  })
})

test.serial('should log in', t => {
  mock.post('/api/login', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', jwtHeader)
  })

  cerebral.setState('user.loginForm.email.value', 'admin@example.com')
  cerebral.setState('user.loginForm.password.value', 'admin0')

  return cerebral.runSignal('user.loginFormSubmitted')
    .then(({state}) => ([
      t.true(state.user.autenticated),
      t.is(state.user.api['@id'], '/users/1'),
      t.is(state.user.email, 'admin@example.com'),
      t.is(state.user.nickname, 'Admin'),
      t.true(state.user.isAdmin),
      t.is(state.user.loginForm.email.value, ''),
      t.is(state.user.loginForm.password.value, ''),
      t.false(state.user.loginForm.showErrors),
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

  cerebral.setState('user.loginForm.email.value', 'admin@example.com')
  cerebral.setState('user.loginForm.password.value', 'wrong_password')

  return cerebral.runSignal('user.loginFormSubmitted')
    .then(({state}) => ([
      t.false(state.user.autenticated),
      t.is(state.user.loginForm.email.value, 'admin@example.com'),
      t.is(state.user.loginForm.password.value, '')
    ]))
})

test.serial('should not log in on server error', t => {
  mock.post('/api/login', (req, res) => {
    return res
      .status(501)
  })

  cerebral.setState('user.loginForm.email.value', 'admin@example.com')
  cerebral.setState('user.loginForm.password.value', 'admin0')

  return cerebral.runSignal('user.loginFormSubmitted')
    .then(({state}) => ([
      t.false(state.user.autenticated),
      t.is(state.user.loginForm.email.value, 'admin@example.com'),
      t.is(state.user.loginForm.password.value, '')
    ]))
})

test('should be logged out', t => {
  cerebral.setState('user.autenticated', true)
  cerebral.setState('user.email', 'admin@example.com')
  cerebral.setState('user.nickname', 'Admin')
  cerebral.setState('user.isAdmin', true)

  return cerebral.runSignal('user.logoutButtonClicked')
    .then(({state}) => ([
      t.false(state.user.autenticated),
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
  })

  cerebral.setState('user.registerForm.nickname.value', 'Test')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'test0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'test0')

  return cerebral.runSignal('user.registerFormSubmitted')
    .then(({state}) => ([
      t.is(state.app.currentPage, 'login'),
      t.is(state.user.registerForm.nickname.value, ''),
      t.is(state.user.registerForm.email.value, ''),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors)
    ]))
})

test.serial('should not register when nickname is Admin', t => {
  cerebral.setState('user.registerForm.nickname.value', 'Admin')
  cerebral.setState('user.registerForm.email.value', 'admin@example.com')
  cerebral.setState('user.registerForm.password.value', 'admin0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'admin0')

  return cerebral.runSignal('user.registerFormSubmitted')
    .then(({state}) => ([
      t.is(state.app.currentPage, null),
      t.is(state.user.registerForm.nickname.value, 'Admin'),
      t.is(state.user.registerForm.email.value, 'admin@example.com'),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors)
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

  cerebral.setState('user.registerForm.nickname.value', 'Test')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'test0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'test0')

  return cerebral.runSignal('user.registerFormSubmitted')
    .then(({state}) => ([
      t.is(state.app.flash, null),
      t.is(state.user.registerForm.nickname.value, 'Test'),
      t.is(state.user.registerForm.email.value, 'test@example.com'),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors)
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

  cerebral.setState('user.registerForm.nickname.value', 'Test')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'test0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'test0')

  return cerebral.runSignal('user.registerFormSubmitted')
    .then(({state}) => ([
      t.is(state.app.flash, null),
      t.is(state.user.registerForm.nickname.value, 'Test'),
      t.is(state.user.registerForm.email.value, 'test@example.com'),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors)
    ]))
})
