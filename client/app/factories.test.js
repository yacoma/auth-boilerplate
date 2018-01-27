import { runSignal } from 'cerebral/test'

import * as factories from './factories'

test('show flash', () => {
  return runSignal(factories.showFlash('Test message'), {
    state: {
      app: {},
    },
  }).then(({ state }) => [
    expect(state.flash).toBe(null),
    expect(state.flashType).toBe(null),
  ])
})

test('show flash for 3s', () => {
  return runSignal(factories.showFlash('Test error', 'error', 3000), {
    state: {
      app: {},
    },
  }).then(({ state }) => [
    expect(state.flash).toBe(null),
    expect(state.flashType).toBe(null),
  ])
})
