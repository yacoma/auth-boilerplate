import test from 'ava'
import mock from 'xhr-mock'
import { CerebralTest } from 'cerebral/test'

import app from '../..'
import { authHeader } from '../../test_constants'

let cerebral

test.beforeEach(t => {
  localStorage.removeItem('jwtHeader')
  mock.setup()
  cerebral = CerebralTest(app({ flash: null, flashType: null }))
})

test.serial('should login', t => {
  mock.post('/api/login', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', authHeader.userJwt)
  })

  cerebral.setState('user.loginForm.email.value', 'test@example.com')
  cerebral.setState('user.loginForm.password.value', 'secret0')

  return cerebral
    .runSignal('user.loginFormSubmitted')
    .then(({ state }) => [
      t.true(state.user.authenticated),
      t.is(state.user.api['@id'], '/users/1'),
      t.is(state.user.email, 'test@example.com'),
      t.is(state.user.nickname, 'Tester'),
      t.false(state.user.isAdmin),
      t.is(state.user.loginForm.email.value, ''),
      t.is(state.user.loginForm.password.value, ''),
      t.false(state.user.loginForm.showErrors),
      t.is(localStorage.getItem('jwtHeader'), '"' + authHeader.userJwt + '"'),
    ])
})

test.serial('should not log in when wrong password', t => {
  mock.post('/api/login', (req, res) => {
    return res
      .status(403)
      .header('Content-Type', 'application/json')
      .body(
        JSON.stringify({
          validationError: 'Invalid email or password',
        })
      )
  })

  cerebral.setState('user.loginForm.email.value', 'test@example.com')
  cerebral.setState('user.loginForm.password.value', 'wrong_password')

  return cerebral
    .runSignal('user.loginFormSubmitted')
    .then(({ state }) => [
      t.false(state.user.authenticated),
      t.is(state.user.loginForm.email.value, 'test@example.com'),
      t.is(state.user.loginForm.password.value, ''),
    ])
})

test.serial('should not log in on server error', t => {
  mock.post('/api/login', (req, res) => {
    return res.status(501)
  })

  cerebral.setState('user.loginForm.email.value', 'test@example.com')
  cerebral.setState('user.loginForm.password.value', 'secret0')

  return cerebral
    .runSignal('user.loginFormSubmitted')
    .then(({ state }) => [
      t.false(state.user.authenticated),
      t.is(state.user.loginForm.email.value, 'test@example.com'),
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
  mock.post('/api/users', (req, res) => {
    return res.status(201).header('Content-Type', 'application/json')
  })

  mock.post('/api/login', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', authHeader.userJwt)
  })

  cerebral.setState('user.registerForm.nickname.value', 'Tester')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'secret0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'secret0')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.true(state.user.authenticated),
      t.is(state.user.api['@id'], '/users/1'),
      t.is(state.user.email, 'test@example.com'),
      t.is(state.user.nickname, 'Tester'),
      t.is(state.user.isAdmin, false),
      t.is(localStorage.getItem('jwtHeader'), '"' + authHeader.userJwt + '"'),
      t.is(state.currentPage, 'home'),
      t.is(state.user.registerForm.nickname.value, ''),
      t.is(state.user.registerForm.email.value, ''),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors),
    ])
})

test.serial('should not register when email exists', t => {
  mock.post('/api/users', (req, res) => {
    return res
      .status(409)
      .header('Content-Type', 'application/json')
      .body(
        JSON.stringify({
          validationError: 'Email already exists',
        })
      )
  })

  cerebral.setState('user.registerForm.nickname.value', 'Tester')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'secret0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'secret0')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.is(state.flash, null),
      t.is(state.user.registerForm.nickname.value, 'Tester'),
      t.is(state.user.registerForm.email.value, 'test@example.com'),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors),
    ])
})

test.serial('should not register when email server does not exists', t => {
  mock.post('/api/users', (req, res) => {
    return res
      .status(422)
      .header('Content-Type', 'application/json')
      .body(
        JSON.stringify({
          '@id': '/users/1',
          email: ['Email could not be delivered'],
        })
      )
  })

  cerebral.setState('user.registerForm.nickname.value', 'Tester')
  cerebral.setState('user.registerForm.email.value', 'test@not.existing.com')
  cerebral.setState('user.registerForm.password.value', 'secret0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'secret0')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.is(state.flash, null),
      t.is(state.user.registerForm.nickname.value, 'Tester'),
      t.is(state.user.registerForm.email.value, 'test@not.existing.com'),
      t.is(state.user.registerForm.password.value, ''),
      t.is(state.user.registerForm.confirmPassword.value, ''),
      t.false(state.user.registerForm.showErrors),
    ])
})

test.serial('should not send register form when email is not valid', t => {
  cerebral.setState('user.registerForm.nickname.value', 'Tester')
  cerebral.setState('user.registerForm.email.value', 'not.an.email')
  cerebral.setState('user.registerForm.password.value', 'secret0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'secret0')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.true(state.user.registerForm.showErrors),
      t.is(state.user.registerForm.nickname.value, 'Tester'),
      t.is(state.user.registerForm.email.value, 'not.an.email'),
      t.is(state.user.registerForm.password.value, 'secret0'),
      t.is(state.user.registerForm.confirmPassword.value, 'secret0'),
    ])
})

test.serial('should not send register form when password is to short', t => {
  cerebral.setState('user.registerForm.nickname.value', 'Tester')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'mini')
  cerebral.setState('user.registerForm.confirmPassword.value', 'mini')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.true(state.user.registerForm.showErrors),
      t.is(state.user.registerForm.nickname.value, 'Tester'),
      t.is(state.user.registerForm.email.value, 'test@example.com'),
      t.is(state.user.registerForm.password.value, 'mini'),
      t.is(state.user.registerForm.confirmPassword.value, 'mini'),
    ])
})

test.serial('should not send register form when passwords are not equal', t => {
  cerebral.setState('user.registerForm.nickname.value', 'Tester')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'secret0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'secret1')

  return cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      t.true(state.user.registerForm.showErrors),
      t.is(state.user.registerForm.nickname.value, 'Tester'),
      t.is(state.user.registerForm.email.value, 'test@example.com'),
      t.is(state.user.registerForm.password.value, 'secret0'),
      t.is(state.user.registerForm.confirmPassword.value, 'secret1'),
    ])
})
