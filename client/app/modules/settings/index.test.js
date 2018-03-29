import mock from 'xhr-mock'
import { CerebralTest } from 'cerebral/test'

import app from '../..'

let cerebral

beforeEach(() => {
  localStorage.setItem('jwtHeader', JSON.stringify(authHeader.userJwt))
  mock.setup()
  cerebral = CerebralTest(app({ flash: null, flashType: null }))
})

test('should change nickname', async () => {
  expect.assertions(1)

  mock.put('/api/users/1', (req, res) => {
    return res.status(200).header('Content-Type', 'application/json')
  })

  cerebral.setState('user.nickname', 'OldTest')
  cerebral.setState('user.api.@id', '/users/1')
  cerebral.setState('settings.profileForm.nickname.value', 'NewTest')

  await cerebral
    .runSignal('settings.profileFormSubmitted')
    .then(({ state }) => [expect(state.user.nickname).toBe('NewTest')])
})

test('should change email', async () => {
  expect.assertions(1)

  mock.put('/api/users/1', (req, res) => {
    return res.status(200).header('Content-Type', 'application/json')
  })

  mock.post('/api/login', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', authHeader.userJwt)
  })

  cerebral.setState('user.email', 'old-test@example.com')
  cerebral.setState('user.api.@id', '/users/1')
  cerebral.setState('settings.emailForm.password.value', 'secret0')
  cerebral.setState('settings.emailForm.email.value', 'new-test@example.com')

  await cerebral
    .runSignal('settings.emailFormSubmitted')
    .then(({ state }) => [
      expect(state.user.email).toBe('new-test@example.com'),
    ])
})
