import mock from 'xhr-mock'
import { CerebralTest } from 'cerebral/test'

import app from '../..'

let cerebral

beforeEach(() => {
  localStorage.removeItem('jwtHeader')
  mock.setup()
  cerebral = CerebralTest(app({ flash: null, flashType: null }))
})

test('should login', async () => {
  expect.assertions(9)

  mock.post('/api/login', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', authHeader.userJwt)
  })

  cerebral.setState('user.loginForm.email.value', 'test@example.com')
  cerebral.setState('user.loginForm.password.value', 'secret0')

  await cerebral
    .runSignal('user.loginFormSubmitted')
    .then(({ state }) => [
      expect(state.user.authenticated).toBe(true),
      expect(state.user.api['@id']).toBe('/users/1'),
      expect(state.user.email).toBe('test@example.com'),
      expect(state.user.nickname).toBe('Tester'),
      expect(state.user.isAdmin).toBe(false),
      expect(state.user.loginForm.email.value).toBe(''),
      expect(state.user.loginForm.password.value).toBe(''),
      expect(state.user.loginForm.showErrors).toBe(false),
      expect(localStorage.getItem('jwtHeader')).toBe(
        '"' + authHeader.userJwt + '"'
      ),
    ])
})

test('should not log in when wrong password', async () => {
  expect.assertions(3)

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

  await cerebral
    .runSignal('user.loginFormSubmitted')
    .then(({ state }) => [
      expect(state.user.authenticated).toBe(false),
      expect(state.user.loginForm.email.value).toBe('test@example.com'),
      expect(state.user.loginForm.password.value).toBe(''),
    ])
})

test('should not log in on server error', async () => {
  expect.assertions(3)

  mock.post('/api/login', (req, res) => {
    return res.status(501)
  })

  cerebral.setState('user.loginForm.email.value', 'test@example.com')
  cerebral.setState('user.loginForm.password.value', 'secret0')

  await cerebral
    .runSignal('user.loginFormSubmitted')
    .then(({ state }) => [
      expect(state.user.authenticated).toBe(false),
      expect(state.user.loginForm.email.value).toBe('test@example.com'),
      expect(state.user.loginForm.password.value).toBe(''),
    ])
})

test('should be logged out', async () => {
  expect.assertions(4)

  cerebral.setState('user.authenticated', true)
  cerebral.setState('user.email', 'admin@example.com')
  cerebral.setState('user.nickname', 'Admin')
  cerebral.setState('user.isAdmin', true)

  await cerebral
    .runSignal('user.logoutButtonClicked')
    .then(({ state }) => [
      expect(state.user.authenticated).toBe(false),
      expect(state.user.email).toBe(''),
      expect(state.user.nickname).toBe(''),
      expect(state.user.isAdmin).toBe(false),
    ])
})

test('should login on registration', async () => {
  expect.assertions(12)

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

  await cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      expect(state.user.authenticated).toBe(true),
      expect(state.user.api['@id']).toBe('/users/1'),
      expect(state.user.email).toBe('test@example.com'),
      expect(state.user.nickname).toBe('Tester'),
      expect(state.user.isAdmin).toBe(false),
      expect(localStorage.getItem('jwtHeader')).toBe(
        '"' + authHeader.userJwt + '"'
      ),
      expect(state.currentPage).toBe('home'),
      expect(state.user.registerForm.nickname.value).toBe(''),
      expect(state.user.registerForm.email.value).toBe(''),
      expect(state.user.registerForm.password.value).toBe(''),
      expect(state.user.registerForm.confirmPassword.value).toBe(''),
      expect(state.user.registerForm.showErrors).toBe(false),
    ])
})

test('should not register when email exists', async () => {
  expect.assertions(6)

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

  await cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      expect(state.flash).toBe(null),
      expect(state.user.registerForm.nickname.value).toBe('Tester'),
      expect(state.user.registerForm.email.value).toBe('test@example.com'),
      expect(state.user.registerForm.password.value).toBe(''),
      expect(state.user.registerForm.confirmPassword.value).toBe(''),
      expect(state.user.registerForm.showErrors).toBe(false),
    ])
})

test('should not register when email server does not exists', async () => {
  expect.assertions(6)

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

  await cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      expect(state.flash).toBe(null),
      expect(state.user.registerForm.nickname.value).toBe('Tester'),
      expect(state.user.registerForm.email.value).toBe('test@not.existing.com'),
      expect(state.user.registerForm.password.value).toBe(''),
      expect(state.user.registerForm.confirmPassword.value).toBe(''),
      expect(state.user.registerForm.showErrors).toBe(false),
    ])
})

test('should not send register form when email is not valid', async () => {
  expect.assertions(5)

  cerebral.setState('user.registerForm.nickname.value', 'Tester')
  cerebral.setState('user.registerForm.email.value', 'not.an.email')
  cerebral.setState('user.registerForm.password.value', 'secret0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'secret0')

  await cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      expect(state.user.registerForm.showErrors).toBe(true),
      expect(state.user.registerForm.nickname.value).toBe('Tester'),
      expect(state.user.registerForm.email.value).toBe('not.an.email'),
      expect(state.user.registerForm.password.value).toBe('secret0'),
      expect(state.user.registerForm.confirmPassword.value).toBe('secret0'),
    ])
})

test('should not send register form when password is to short', async () => {
  expect.assertions(5)

  cerebral.setState('user.registerForm.nickname.value', 'Tester')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'mini')
  cerebral.setState('user.registerForm.confirmPassword.value', 'mini')

  await cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      expect(state.user.registerForm.showErrors).toBe(true),
      expect(state.user.registerForm.nickname.value).toBe('Tester'),
      expect(state.user.registerForm.email.value).toBe('test@example.com'),
      expect(state.user.registerForm.password.value).toBe('mini'),
      expect(state.user.registerForm.confirmPassword.value).toBe('mini'),
    ])
})

test('should not send register form when passwords are not equal', async () => {
  expect.assertions(5)

  cerebral.setState('user.registerForm.nickname.value', 'Tester')
  cerebral.setState('user.registerForm.email.value', 'test@example.com')
  cerebral.setState('user.registerForm.password.value', 'secret0')
  cerebral.setState('user.registerForm.confirmPassword.value', 'secret1')

  await cerebral
    .runSignal('user.registerFormSubmitted')
    .then(({ state }) => [
      expect(state.user.registerForm.showErrors).toBe(true),
      expect(state.user.registerForm.nickname.value).toBe('Tester'),
      expect(state.user.registerForm.email.value).toBe('test@example.com'),
      expect(state.user.registerForm.password.value).toBe('secret0'),
      expect(state.user.registerForm.confirmPassword.value).toBe('secret1'),
    ])
})
