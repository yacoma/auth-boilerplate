import test from 'ava'
import { runSignal } from 'cerebral/test'

import * as factories from './factories'

test('show flash', t => {
  return runSignal(factories.showFlash('Test message'), {
    state: {
      app: {},
    },
  }).then(({ state }) => [
    t.is(state.flash, 'Test message'),
    t.is(state.flashType, null),
  ])
})

test('show flash for 3s', t => {
  return runSignal(factories.showFlash('Test error', 'error', 3000), {
    state: {
      app: {},
    },
  }).then(({ state }) => [t.is(state.flash, null), t.is(state.flashType, null)])
})
