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
  function NicknameField ({form, path, fieldChanged}) {
    const showError = (field) => (
      form.showErrors && !field.isValid && field.errorMessage !== null
    )
    return (
      <Form.Field error={showError(form.nickname)}>
        <Input
          icon='user'
          iconPosition='left'
          placeholder='Nickname'
          value={form.nickname.value}
          onChange={(event) => fieldChanged({
            field: path,
            value: event.target.value
          })}
        />
        <Label
          pointing
          basic
          color='red'
          style={{display: showError(form.nickname) ? 'inline-block' : 'none'}}
        >
          {form.nickname.errorMessage}
        </Label>
      </Form.Field>
    )
  }
)
