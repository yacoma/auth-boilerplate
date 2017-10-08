import { sequence } from 'cerebral'
import { equals, set } from 'cerebral/operators'
import { props } from 'cerebral/tags'
import showFlash from './showFlash'

function getSchemaValidationErrorMessages({ props }) {
  const errorMessages = Object.keys(
    props.error.response.result
  ).reduce((errorMessages, errorField) => {
    if (Array.isArray(props.error.response.result[errorField])) {
      errorMessages.push(
        errorField + ': ' + props.error.response.result[errorField].join(', ')
      )
    }
    return errorMessages
  }, [])
  return { errorMessages: errorMessages.join('\n') }
}

function showValidationError(defaultErrorMessage) {
  return sequence('Show validation error', [
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
  ])
}

export default showValidationError
