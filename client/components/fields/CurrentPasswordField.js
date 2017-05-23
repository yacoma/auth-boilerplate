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
  function CurrentPasswordField({path, form, fieldChanged}) {
    return (
      <Form.Field error={hasError(form, form.currentPassword)}>
        <Input
          type="password"
          icon="lock"
          iconPosition="left"
          placeholder="current password"
          value={form.currentPassword.value}
          onChange={(e, {value}) => fieldChanged({value, field: path})}
        />
        <Label
          pointing
          basic
          color="red"
          style={{
            display: showError(form, form.currentPassword)
              ? 'inline-block'
              : 'none',
          }}
        >
          {form.currentPassword.errorMessage}
        </Label>
      </Form.Field>
    )
  }
)
