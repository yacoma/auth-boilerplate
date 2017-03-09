import {test} from 'tap'
import {runAction} from 'cerebral/test'
import showFlash from './showFlash'

test('show flash', test => {
  return runAction(showFlash('Test message'), {
    state: {
      app: {}
    }
  })
  .then(({state}) => [
    test.equal(state.app.flash, null),
    test.equal(state.app.flashType, null)
  ])
})

test('show flash 3 sec', test => {
  return runAction(showFlash('Test error', 'error', 3000), {
    state: {
      app: {}
    }
  })
  .then(({state}) => [
    test.equal(state.app.flash, null),
    test.equal(state.app.flashType, null)
  ])
})
