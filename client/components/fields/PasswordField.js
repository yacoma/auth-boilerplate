import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal} from 'cerebral/tags'
import {form} from 'cerebral-provider-forms'
import {Form, Input, Label} from 'semantic-ui-react'

export default connect({
  form: form(props`form`),
  path: props`path`,
  fieldChanged: signal`user.fieldChanged`
},
  function PasswordField ({form, path, fieldChanged}) {
    const showError = (field) => (
      form.showErrors && !field.isValid && field.errorMessage !== null
    )
    return (
      <Form.Field error={showError(form.password)}>
        <Input
          type='password'
          icon='lock'
          iconPosition='left'
          placeholder='Password'
          value={form.password.value}
          onChange={(event) => fieldChanged({
            field: path,
            value: event.target.value
          })}
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
