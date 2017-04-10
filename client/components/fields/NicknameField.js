import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal} from 'cerebral/tags'
import {form} from 'cerebral-provider-forms'
import {Form, Input, Label} from 'semantic-ui-react'
import {hasError, showError} from './utils'

export default connect({
  form: form(props`form`),
  fieldChanged: signal`user.fieldChanged`
},
  function NicknameField ({path, form, fieldChanged}) {
    return (
      <Form.Field error={hasError(form, form.nickname)}>
        <Input
          icon='user'
          iconPosition='left'
          placeholder='nickname'
          value={form.nickname.value}
          onChange={(e, {value}) => fieldChanged({value, field: path})}
        />
        <Label
          pointing
          basic
          color='red'
          style={{display: showError(form, form.nickname) ? 'inline-block' : 'none'}}
        >
          {form.nickname.errorMessage}
        </Label>
      </Form.Field>
    )
  }
)
