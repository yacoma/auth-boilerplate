export const hasError = (form, field) => form.showErrors && !field.isValid

export const showError = (form, field) =>
  form.showErrors &&
  !field.isValid &&
  field.hasValue &&
  field.errorMessage !== null
