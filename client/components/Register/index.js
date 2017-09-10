import React from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import { Grid, Form, Segment, Button, Dimmer, Loader } from 'semantic-ui-react'
import {
  NicknameField,
  EmailField,
  PasswordField,
  ConfirmPasswordField,
} from '../fields'

export default connect(
  {
    isLoading: state`user.registerForm.isLoading`,
    showErrors: state`user.registerForm.showErrors`,
    formSubmitted: signal`user.registerFormSubmitted`,
  },
  function Register({ isLoading, showErrors, formSubmitted }) {
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
                <Dimmer inverted active={isLoading}>
                  <Loader />
                </Dimmer>
                <NicknameField
                  path={'user.registerForm.nickname'}
                  showErrors={showErrors}
                />
                <EmailField
                  path={'user.registerForm.email'}
                  showErrors={showErrors}
                />
                <PasswordField
                  path={'user.registerForm.password'}
                  showErrors={showErrors}
                />
                <ConfirmPasswordField
                  path={'user.registerForm.confirmPassword'}
                  showErrors={showErrors}
                />
                <Button fluid size="large" color="blue" onClick={handleSubmit}>
                  Sign up
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
)
