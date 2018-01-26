import { state, props } from 'cerebral/tags'
import { set, equals, debounce } from 'cerebral/operators'

import * as actions from './actions'

const showFlashDebounce = debounce.shared()

export function showFlash(flash, flashType = null, ms = 7000) {
  return [
    set(state`flash`, flash),
    set(state`flashType`, flashType),
    showFlashDebounce(ms),
    {
      continue: [set(state`flash`, null), set(state`flashType`, null)],
      discard: [],
    },
  ]
}

export function showValidationError(defaultErrorMessage) {
  return [
    equals(props`error.response.status`),
    {
      403: set(
        props`errorMessages`,
        props`error.response.result.validationError`
      ),
      409: set(
        props`errorMessages`,
        props`error.response.result.validationError`
      ),
      422: actions.getSchemaValidationErrorMessages,
      otherwise: set(props`errorMessages`, defaultErrorMessage),
    },
    showFlash(props`errorMessages`, 'error'),
  ]
}
