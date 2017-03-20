import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Header, Icon, Form, Segment, Button, Message, Dimmer, Loader}
    from 'semantic-ui-react'
import {EmailField, PasswordField} from '../fields'

export default connect({
  signIn: state`user.signIn`,
  signInSubmitted: signal`user.loginFormSubmitted`
},
  function Login ({signIn, signInSubmitted}) {
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
              <EmailField form={signIn} path={'user.signIn.email'} />
              <PasswordField form={signIn} path={'user.signIn.password'} />
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
          <Message>
            Forgot your password?
            <a href='/reset'> Reset Password</a>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
)
