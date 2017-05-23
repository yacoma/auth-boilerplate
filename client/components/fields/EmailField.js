import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal} from 'cerebral/tags'
import {form} from '@cerebral/forms'
import {Form, Input, Label} from 'semantic-ui-react'
import {hasError, showError} from './utils'

export default connect(
  {
    form: form(props`form`),
    fieldChanged: signal`user.fieldChanged`,
  },
  function EmailField({path, form, fieldChanged}) {
    return (
      <Form.Field error={hasError(form, form.email)}>
        <Input
          icon="mail"
          iconPosition="left"
          placeholder="email address"
          value={form.email.value}
          onChange={(e, {value}) => fieldChanged({value, field: path})}
        />
        <Label
          pointing
          basic
          color="red"
          style={{
            display: showError(form, form.email) ? 'inline-block' : 'none',
          }}
        >
          {form.email.errorMessage}
        </Label>
      </Form.Field>
    )
  }
)
