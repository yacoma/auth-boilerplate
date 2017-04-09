import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal} from 'cerebral/tags'
import {form} from 'cerebral-provider-forms'
import {Form, Input, Label} from 'semantic-ui-react'

export default connect({
  form: form(props`form`),
  fieldChanged: signal`user.fieldChanged`
},
  function ConfirmPasswordField ({path, form, fieldChanged}) {
    const hasError = (field) => (
      form.showErrors && !field.isValid
    )
    const showError = (field) => (
      form.showErrors && !field.isValid && field.hasValue && field.errorMessage !== null
    )
    return (
      <Form.Field error={hasError(form.confirmPassword)}>
        <Input
          type='password'
          icon='lock'
          iconPosition='left'
          placeholder='confirm password'
          value={form.confirmPassword.value}
          onChange={(e, {value}) => fieldChanged({value, field: path})}
        />
        <Label
          pointing
          basic
          color='red'
          style={{display: showError(form.confirmPassword) ? 'inline-block' : 'none'}}
        >
          {form.confirmPassword.errorMessage}
        </Label>
      </Form.Field>
    )
  }
)
