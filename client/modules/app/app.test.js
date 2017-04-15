import test from 'ava'
import mock from 'xhr-mock'
import StorageProvider from 'cerebral-provider-storage'
import HttpProvider from 'cerebral-provider-http'
import {CerebralTest} from 'cerebral/test'

import App from '.'
import User from '../user'

const jwtHeader = (
  'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiIvdXNlcnMvMSIs' +
  'Im5pY2tuYW1lIjoiQWRtaW4iLCJub25jZSI6IjkxZTc4N2Y4YWU5ZTRhNmE5ZTMzN' +
  'zU1MzFjYWU0OWFjIiwic3ViIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJpc0FkbWluIj' +
  'p0cnVlfQ.anr0ZkRErPzXT0DAhLjSegaC9vpK7u2FgqETzEg-h-A'
)

let cerebral

test.beforeEach(t => {
  mock.setup()
  localStorage.removeItem('jwtHeader')
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

test('should authenticate when valid token in localStorage', t => {
  localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))
  return cerebral.runSignal('app.appMounted')
    .then(({state}) => [
      t.true(state.user.authenticated),
      t.is(state.user.nickname, 'Admin')
    ])
})

test('should refresh token when expired token and refresh allowed', t => {
  const expiredJwtHeader = (
    'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkB' +
    'leGFtcGxlLmNvbSIsInVpZCI6Ii91c2Vycy8xIiwibmlja25hbWUiOiJBZG1' +
    'pbiIsImlzQWRtaW4iOnRydWUsImV4cCI6MTQ5MDk5NjEzNCwibm9uY2UiOiI' +
    '5MWU3ODdmOGFlOWU0YTZhOWUzMzc1NTMxY2FlNDlhYyJ9.Id7aZJ-NajQv6G' +
    'loYjwq1ZBuNUKVMJo04FqW3WKG_TY'
  )

  const returnJwtHeader = (
    'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkB' +
    'leGFtcGxlLmNvbSIsInVpZCI6Ii91c2Vycy8xIiwibmlja25hbWUiOiJBZG1' +
    'pbiIsImlzQWRtaW4iOnRydWUsIm5vbmNlIjoiNzc2NDdmMTg0M2QyNDA5MWE' +
    'wNDJkM2M2NWVjNzk3YzkifQ.Xp7_EUm1YFHqHhKFrPOivzMsos1YW0uyE13k' +
    'XYzuxuc'
  )

  localStorage.setItem('jwtHeader', JSON.stringify(expiredJwtHeader))

  mock.get('/api/refresh', (req, res) => {
    return res
      .status(200)
      .header('Content-Type', 'application/json')
      .header('Authorization', returnJwtHeader)
  })

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
          'Authorization': expiredJwtHeader
        }
      }),
      StorageProvider({target: localStorage})
    ]
  })

  return cerebral.runSignal('app.appMounted')
    .then(({state}) => [
      t.true(state.user.authenticated),
      t.is(state.user.nickname, 'Admin')
    ])
})
