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
  function ConfirmPasswordField({path, form, fieldChanged}) {
    return (
      <Form.Field error={hasError(form, form.confirmPassword)}>
        <Input
          type="password"
          icon="lock"
          iconPosition="left"
          placeholder="confirm password"
          value={form.confirmPassword.value}
          onChange={(e, {value}) => fieldChanged({value, field: path})}
        />
        <Label
          pointing
          basic
          color="red"
          style={{
            display: showError(form, form.confirmPassword)
              ? 'inline-block'
              : 'none',
          }}
        >
          {form.confirmPassword.errorMessage}
        </Label>
      </Form.Field>
    )
  }
)
