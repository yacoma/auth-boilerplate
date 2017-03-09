import t from 'tap'
import {RunSignal} from 'cerebral/test'

import App from '../app'
import User from '.'

t.test('test User module', function (t) {
  const runSignal = RunSignal({
    modules: {
      app: App({'flash': null, 'flashType': null}),
      user: User({'@id': null})
    }
  })

  t.test('user should be logged out', function (t) {
    return runSignal('user.logoutButtonClicked')
      .then(({state}) => ([
        t.equal(state.user.isLoggedIn, false),
        t.same(state.user.api, {})
      ]))
      .catch(t.threw)
      .then(t.end)
  })

  t.end()
})
