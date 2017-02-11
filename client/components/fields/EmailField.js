import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal} from 'cerebral/tags'
import {Form, Input, Label} from 'semantic-ui-react'

export default connect({
  form: props`form`,
  path: props`path`,
  fieldChanged: signal`user.fieldChanged`
},
  function EmailField ({form, path, fieldChanged}) {
    const showError = field => form.showErrors && !field.isValid && field.errorMessage !== null
    return (
      <Form.Field error={showError(form.email)}>
        <Input
          icon='mail'
          iconPosition='left'
          placeholder='E-mail address'
          value={form.email.value}
          onChange={(event) => fieldChanged({
            field: path,
            value: event.target.value
          })}
        />
        <Label
          pointing
          basic
          color='red'
          style={{display: showError(form.email) ? 'inline-block' : 'none'}}
        >
          {form.email.errorMessage}
        </Label>
      </Form.Field>
    )
  }
)
