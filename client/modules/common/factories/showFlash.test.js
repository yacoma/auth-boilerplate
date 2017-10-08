import test from 'ava'
import { runSignal } from 'cerebral/test'
import showFlash from './showFlash'

test('show flash', t => {
  return runSignal(showFlash('Test message'), {
    state: {
      app: {},
    },
  }).then(({ state }) => [
    t.is(state.app.flash, 'Test message'),
    t.is(state.app.flashType, null),
  ])
})

test('show flash 3s', t => {
  return runSignal(showFlash('Test error', 'error', 3000), {
    state: {
      app: {},
    },
  }).then(({ state }) => [
    t.is(state.app.flash, null),
    t.is(state.app.flashType, null),
  ])
})
