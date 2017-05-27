import test from 'ava'
import mock from 'xhr-mock'

import HttpProvider from '@cerebral/http'
import StorageProvider from '@cerebral/storage'
import { CerebralTest } from 'cerebral/test'

import App from '../app'
import User from '../user'
import Settings from '.'

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
      settings: Settings,
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
      .header('Authorization', jwtHeader)
  })

  cerebral.setState('user.email', 'old-test@example.com')
  cerebral.setState('user.api.@id', '/users/1')
  cerebral.setState('settings.emailForm.password.value', 'test0')
  cerebral.setState('settings.emailForm.email.value', 'new-test@example.com')

  return cerebral
    .runSignal('settings.emailFormSubmitted')
    .then(({ state }) => [t.is(state.user.email, 'new-test@example.com')])
})
