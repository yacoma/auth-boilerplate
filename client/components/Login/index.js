import React from 'react'
import {connect} from 'cerebral/react'
import {
  Grid, Header, Icon, Form, Segment, Input, Button, Label, Message, Dimmer, Loader
} from 'semantic-ui-react'

export default connect({
  signIn: 'user.signIn.**'
}, {
  fieldChanged: 'user.fieldChanged',
  signInSubmitted: 'user.loginFormSubmitted'
},
  function Login ({fieldChanged, signInSubmitted, signIn}) {
    const showError = field => signIn.showErrors && !field.isValid
    const handleSubmit = (event) => {
      event.preventDefault()
      signInSubmitted()
    }
    return (
      <Grid centered>
        <Grid.Column>
          <Header as='h1' textAlign='center' color='blue' icon>
            <Icon name='user' />
            Log-in to your account
          </Header>
          <Message
            warning
            header={signIn.validationError}
            hidden={!signIn.validationError}
          />
          <Form size='large'>
            <Segment>
              <Dimmer
                inverted
                active={signIn.isLoading}
              >
                <Loader />
              </Dimmer>
              <Form.Field error={showError(signIn.email)}>
                <Input
                  icon='mail'
                  iconPosition='left'
                  placeholder='E-mail address'
                  value={signIn.email.value}
                  onChange={(event) => fieldChanged({
                    field: 'user.signIn.email',
                    value: event.target.value
                  })}
                />
                <Label
                  pointing
                  basic
                  color='red'
                  style={{display: showError(signIn.email) ? 'inline-block' : 'none'}}
                >
                  {signIn.email.errorMessage}
                </Label>
              </Form.Field>
              <Form.Field error={showError(signIn.password)}>
                <Input
                  type='password'
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  value={signIn.password.value}
                  onChange={(event) => fieldChanged({
                    field: 'user.signIn.password',
                    value: event.target.value
                  })}
                />
                <Label
                  pointing
                  basic
                  color='red'
                  style={{display: showError(signIn.password) ? 'inline-block' : 'none'}}
                 >
                  {signIn.password.errorMessage}
                </Label>
              </Form.Field>
              <Button
                fluid
                size='large'
                color='blue'
                onClick={handleSubmit}
              >
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us?
            <a href='/register'> Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
)
