import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal} from 'cerebral/tags'
import {form} from 'cerebral-provider-forms'
import {Form, Input, Label} from 'semantic-ui-react'

export default connect({
  form: form(props`form`),
  fieldChanged: signal`user.fieldChanged`
},
  function PasswordField ({path, form, fieldChanged}) {
    const hasError = (field) => (
      form.showErrors && !field.isValid
    )
    const showError = (field) => (
      form.showErrors && !field.isValid && field.hasValue && field.errorMessage !== null
    )
    return (
      <Form.Field error={hasError(form.password)}>
        <Input
          type='password'
          icon='lock'
          iconPosition='left'
          placeholder='Password'
          value={form.password.value}
          onChange={(e, {value}) => fieldChanged({value, field: path})}
        />
        <Label
          pointing
          basic
          color='red'
          style={{display: showError(form.password) ? 'inline-block' : 'none'}}
        >
          {form.password.errorMessage}
        </Label>
      </Form.Field>
    )
  }
)
