import test from 'ava'
import mock from 'xhr-mock'
import { CerebralTest } from 'cerebral/test'

import app from '../..'
import { userJwtHeader } from '../../test_constants'

let cerebral

test.beforeEach(t => {
  localStorage.setItem('jwtHeader', JSON.stringify(userJwtHeader))
  mock.setup()
  cerebral = CerebralTest(app({ flash: null, flashType: null }))
})

test.serial('should change nickname', t => {
  mock.put('/api/users/1', (req, res) => {
    return res.status(200).header('Content-Type', 'application/json')
  })

  cerebral.setState('user.nickname', 'OldTest')
  cerebral.setState('user.api.@id', '/users/1')
  cerebral.setState('settings.profileForm.nickname.value', 'NewTest')

  return cerebral
    .runSignal('settings.profileFormSubmitted')
    .then(({ state }) => [t.is(state.user.nickname, 'NewTest')])
})

test.serial('should change email', t => {
  mock.put('/api/users/1', (req, res) => {
    return res.status(200).header('Content-Type', 'application/json')
  })

  mock.post('/api/login', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', userJwtHeader)
  })

  cerebral.setState('user.email', 'old-test@example.com')
  cerebral.setState('user.api.@id', '/users/1')
  cerebral.setState('settings.emailForm.password.value', 'secret0')
  cerebral.setState('settings.emailForm.email.value', 'new-test@example.com')

  return cerebral
    .runSignal('settings.emailFormSubmitted')
    .then(({ state }) => [t.is(state.user.email, 'new-test@example.com')])
})
