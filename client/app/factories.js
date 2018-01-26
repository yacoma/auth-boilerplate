import { state, props } from 'cerebral/tags'
import { set, equals, debounce } from 'cerebral/operators'

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

function getSchemaValidationErrorMessages({ props }) {
  const errorMessages = Object.keys(props.error.response.result).reduce(
    (errorMessages, errorField) => {
      if (Array.isArray(props.error.response.result[errorField])) {
        errorMessages.push(
          errorField + ': ' + props.error.response.result[errorField].join(', ')
        )
      }
      return errorMessages
    },
    []
  )
  return { errorMessages: errorMessages.join('\n') }
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
      422: getSchemaValidationErrorMessages,
      otherwise: set(props`errorMessages`, defaultErrorMessage),
    },
    showFlash(props`errorMessages`, 'error'),
  ]
}
