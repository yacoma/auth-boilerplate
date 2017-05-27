import React from 'react'
import { connect } from 'cerebral/react'
import { state, signal } from 'cerebral/tags'
import {
  Grid,
  Form,
  Segment,
  Button,
  Message,
  Dimmer,
  Loader,
} from 'semantic-ui-react'
import { EmailField, PasswordField } from '../fields'

export default connect(
  {
    loginForm: state`user.loginForm`,
    formSubmitted: signal`user.loginFormSubmitted`,
  },
  function Login({ loginForm, formSubmitted }) {
    const handleSubmit = event => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid stackable padded="vertically" columns={2} centered>
        <Grid.Row>
          <Grid.Column>
            <Form size="large">
              <Segment>
                <Dimmer inverted active={loginForm.isLoading}>
                  <Loader />
                </Dimmer>
                <EmailField form={loginForm} path={'user.loginForm.email'} />
                <PasswordField
                  form={loginForm}
                  path={'user.loginForm.password'}
                />
                <Button fluid size="large" color="blue" onClick={handleSubmit}>
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us?
              <a href="/register"> Sign Up</a>
            </Message>
            <Message>
              Forgot your password?
              <a href="/reset"> Reset Password</a>
            </Message>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
)
