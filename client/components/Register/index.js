import React from 'react'
import {connect} from 'cerebral/react'
import {Grid, Header, Icon, Form, Segment, Input, Button, Label, Message, Dimmer, Loader}
    from 'semantic-ui-react'

export default connect({
  register: 'user.register.**'
}, {
  fieldChanged: 'user.fieldChanged',
  formSubmitted: 'user.registerFormSubmitted'
},
  function Register ({fieldChanged, formSubmitted, register}) {
    const showError = field => register.showErrors && !field.isValid && field.errorMessage !== null
    const handleSubmit = (event) => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid centered>
        <Grid.Column>
          <Header as='h1' textAlign='center' color='blue' icon>
            <Icon name='user' />
            Create account
          </Header>
          <Message
            warning
            header={register.integrityError}
            hidden={!register.integrityError}
          />
          <Form size='large'>
            <Segment>
              <Dimmer
                inverted
                active={register.isLoading}
              >
                <Loader />
              </Dimmer>
              <Form.Field error={showError(register.nickname)}>
                <Input
                  icon='user'
                  iconPosition='left'
                  placeholder='Nickname'
                  value={register.nickname.value}
                  onChange={(event) => fieldChanged({
                    field: 'user.register.nickname',
                    value: event.target.value
                  })}
                />
                <Label
                  pointing
                  basic
                  color='red'
                  style={{display: showError(register.nickname) ? 'inline-block' : 'none'}}
                >
                  {register.nickname.errorMessage}
                </Label>
              </Form.Field>
              <Form.Field error={showError(register.email)}>
                <Input
                  icon='mail'
                  iconPosition='left'
                  placeholder='E-mail address'
                  value={register.email.value}
                  onChange={(event) => fieldChanged({
                    field: 'user.register.email',
                    value: event.target.value
                  })}
                />
                <Label
                  pointing
                  basic
                  color='red'
                  style={{display: showError(register.email) ? 'inline-block' : 'none'}}
                 >
                  {register.email.errorMessage}
                </Label>
              </Form.Field>
              <Form.Field error={showError(register.password)}>
                <Input
                  type='password'
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  value={register.password.value}
                  onChange={(event) => fieldChanged({
                    field: 'user.register.password',
                    value: event.target.value
                  })}
                />
                <Label
                  pointing
                  basic
                  color='red'
                  style={{display: showError(register.password) ? 'inline-block' : 'none'}}
                >
                  {register.password.errorMessage}
                </Label>
              </Form.Field>
              <Form.Field error={showError(register.confirmPassword)}>
                <Input
                  type='password'
                  icon='lock'
                  iconPosition='left'
                  placeholder='confirm password'
                  value={register.confirmPassword.value}
                  onChange={(event) => fieldChanged({
                    field: 'user.register.confirmPassword',
                    value: event.target.value
                  })}
                />
                <Label
                  pointing
                  basic
                  color='red'
                  style={{display: showError(register.confirmPassword) ? 'inline-block' : 'none'}}
                 >
                  {register.confirmPassword.errorMessage}
                </Label>
              </Form.Field>
              <Button
                fluid size='large'
                color='blue'
                onClick={handleSubmit}
              >
                Sign up
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
)
