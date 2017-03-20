function setValidationErrorFactory (errorPath, defaultErrorMessage) {
  function setValidationError ({props, state}) {
    switch (props.status) {
      case 403:
      case 409:
        state.set(errorPath, props.result.validationError)
        break

      case 422:
        let errorMessages = Object.keys(props.result).reduce(
          (errorMessages, errorField) => {
            if (Array.isArray(props.result[errorField])) {
              errorMessages.push(props.result[errorField].join('\n'))
            }
            return errorMessages
          }, []
        )
        state.set(errorPath, errorMessages.join('\n'))
        break

      default:
        state.set(errorPath, defaultErrorMessage)
    }
  }
  return setValidationError
}

export default setValidationErrorFactory
