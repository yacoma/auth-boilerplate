export const hasError = (field, showErrors) => showErrors && !field.isValid

export const showError = (field, showErrors) =>
  showErrors && !field.isValid && field.hasValue && field.errorMessage !== null
