import test from 'ava'
import mock from 'xhr-mock'

import HttpProvider from '@cerebral/http'
import StorageProvider from '@cerebral/storage'
import { CerebralTest } from 'cerebral/test'

import App from '../app'
import User from '.'

const jwtHeader =
  'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
  'Im5pY2tuYW1lIjoiQWRtaW4iLCJub25jZSI6IjkxZTc4N2Y4YWU5ZTRhNmE5ZTMzN' +
  'zU1MzFjYWU0OWFjIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpc0FkbWluIj' +
  'p0cnVlfQ.anr0ZkRErPzXT0DAhLjSegaC9vpK7u2FgqETzEg-h-A'

let cerebral

test.beforeEach(t => {
  localStorage.removeItem('jwtHeader')
  mock.setup()
  cerebral = CerebralTest({
    modules: {
      app: App({ flash: null, flashType: null }),
      user: User({ '@id': null }),
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
      StorageProvider({ target: localStorage }),
    ],
  })
})

test.serial('should login', t => {
  mock.post('/api/login', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', jwtHeader)
  })

  cerebral.setState('user.loginForm.email.value', 'admin@example.com')
  cerebral.setState('user.loginForm.password.value', 'admin0')

  return cerebral
    .runSignal('user.loginFormSubmitted')
    .then(({ state }) => [
      t.true(state.user.authenticated),
      t.is(state.user.api['@id'], '/users/1'),
      t.is(state.user.email, 'admin@example.com'),
      t.is(state.user.nickname, 'Admin'),
      t.true(state.user.isAdmin),
      t.is(state.user.loginForm.email.value, ''),
      t.is(state.user.loginForm.password.value, ''),
      t.false(state.user.loginForm.showErrors),
      t.is(localStorage.getItem('jwtHeader'), '"' + jwtHeader + '"'),
    ])
})

test.serial('should not log in when wrong password', t => {
  mock.post('/api/login', (req, res) => {
    return res.status(403).header('Content-Type', 'application/json').body(
      JSON.stringify({
        validationError: 'Invalid email or password',
      })
    )
  })

  cerebral.setState('user.loginForm.email.value', 'admin@example.com')
  cerebral.setState('user.loginForm.password.value', 'wrong_password')

  return cerebral
    .runSignal('user.loginFormSubmitted')
    .then(({ state }) => [
      t.false(state.user.authenticated),
      t.is(state.user.loginForm.email.value, 'admin@example.com'),
      t.is(state.user.loginForm.password.value, ''),
    ])
})

test.serial('should not log in on server error', t => {
  mock.post('/api/login', (req, res) => {
    return res.status(501)
  })

  cerebral.setState('user.loginForm.email.value', 'admin@example.com')
  cerebral.setState('user.loginForm.password.value', 'admin0')

  return cerebral
    .runSignal('user.loginFormSubmitted')
    .then(({ state }) => [
      t.false(state.user.authenticated),
      t.is(state.user.loginForm.email.value, 'admin@example.com'),
      t.is(state.user.loginForm.password.value, ''),
    ])
})

test('should be logged out', t => {
  cerebral.setState('user.authenticated', true)
  cerebral.setState('user.email', 'admin@example.com')
  cerebral.setState('user.nickname', 'Admin')
  cerebral.setState('user.isAdmin', true)

  return cerebral
    .runSignal('user.logoutButtonClicked')
    .then(({ state }) => [
      t.false(state.user.authenticated),
      t.is(state.user.email, ''),
      t.is(state.user.nickname, ''),
      t.false(state.user.isAdmin),
    ])
})

test.serial('should login on registration', t => {
  const testJwtHeader =
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMiIs' +
    'Im5pY2tuYW1lIjoiVGVzdCIsIm5vbmNlIjoiOTFlNzg3ZjhhZTllNGE2YTllMzM3N' +
    'TUzMWNhZTQ5YWMiLCJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaXNBZG1pbiI6Zm' +
    'Fsc2V9.hdoa3ohnx1evfj35OFavUgT34tmE3DAGm2Ys91Y0gkE'

  mock.post('/api/users', (req, res) => {
    return res.status(201).header('Content-Type', 'application/json')
  })

  mock.post('/api/login', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', testJwtHeader)
  })

  cerebral.setState('user.registerForm.nickname.value', 'Test')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'test0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'test0')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.true(state.user.authenticated),
      t.is(state.user.api['@id'], '/users/2'),
      t.is(state.user.email, 'test@example.com'),
      t.is(state.user.nickname, 'Test'),
      t.is(state.user.isAdmin, false),
      t.is(localStorage.getItem('jwtHeader'), '"' + testJwtHeader + '"'),
      t.is(state.app.currentPage, 'home'),
      t.is(state.user.registerForm.nickname.value, ''),
      t.is(state.user.registerForm.email.value, ''),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors),
    ])
})

test.serial('should not register when email is admin@example.com', t => {
  cerebral.setState('user.registerForm.nickname.value', 'Admin0')
  cerebral.setState('user.registerForm.email.value', 'admin@example.com')
  cerebral.setState('user.registerForm.password.value', 'admin0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'admin0')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.is(state.app.currentPage, null),
      t.is(state.user.registerForm.nickname.value, 'Admin0'),
      t.is(state.user.registerForm.email.value, 'admin@example.com'),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors),
    ])
})

test.serial('should not register when email exists', t => {
  mock.post('/api/users', (req, res) => {
    return res.status(409).header('Content-Type', 'application/json').body(
      JSON.stringify({
        validationError: 'Email already exists',
      })
    )
  })

  cerebral.setState('user.registerForm.nickname.value', 'Test')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'test0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'test0')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.is(state.app.flash, null),
      t.is(state.user.registerForm.nickname.value, 'Test'),
      t.is(state.user.registerForm.email.value, 'test@example.com'),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors),
    ])
})

test.serial('should not register when email server does not exists', t => {
  mock.post('/api/users', (req, res) => {
    return res.status(422).header('Content-Type', 'application/json').body(
      JSON.stringify({
        '@id': '/users/1',
        email: ['Email could not be delivered'],
      })
    )
  })

  cerebral.setState('user.registerForm.nickname.value', 'Test')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'test0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'test0')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.is(state.app.flash, null),
      t.is(state.user.registerForm.nickname.value, 'Test'),
      t.is(state.user.registerForm.email.value, 'test@example.com'),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors),
    ])
})
