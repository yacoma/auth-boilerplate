import {sequence} from 'cerebral'
import {equals, set} from 'cerebral/operators'
import {props} from 'cerebral/tags'
import showFlash from './showFlash'

function getSchemaValidationErrorMessages ({props}) {
  const errorMessages = Object.keys(props.result).reduce(
    (errorMessages, errorField) => {
      if (Array.isArray(props.result[errorField])) {
        errorMessages.push(
          errorField + ': ' + props.result[errorField].join(', ')
        )
      }
      return errorMessages
    }, []
  )
  return {errorMessages: errorMessages.join('\n')}
}

function showValidationError (defaultErrorMessage) {
  return sequence('Show validation error', [
    equals(props`status`), {
      403: set(props`errorMessages`, props`result.validationError`),
      409: set(props`errorMessages`, props`result.validationError`),
      422: getSchemaValidationErrorMessages,
      otherwise: set(props`errorMessages`, defaultErrorMessage)
    },
    showFlash(props`errorMessages`, 'warning')
  ])
}

export default showValidationError
