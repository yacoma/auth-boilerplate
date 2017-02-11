import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal} from 'cerebral/tags'
import {Form, Input, Label} from 'semantic-ui-react'

export default connect({
  form: props`form`,
  path: props`path`,
  fieldChanged: signal`user.fieldChanged`
},
  function ConfirmPasswordField ({form, path, fieldChanged}) {
    const showError = field => form.showErrors && !field.isValid && field.errorMessage !== null
    return (
      <Form.Field error={showError(form.confirmPassword)}>
        <Input
          type='password'
          icon='lock'
          iconPosition='left'
          placeholder='confirm password'
          value={form.confirmPassword.value}
          onChange={(event) => fieldChanged({
            field: path,
            value: event.target.value
          })}
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
