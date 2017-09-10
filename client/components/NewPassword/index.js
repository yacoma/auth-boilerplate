import React from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import { Grid, Form, Segment, Button, Dimmer, Loader } from 'semantic-ui-react'
import { PasswordField, ConfirmPasswordField } from '../fields'

export default connect(
  {
    isLoading: state`user.passwordForm.isLoading`,
    showErrors: state`user.passwordForm.showErrors`,
    formSubmitted: signal`user.passwordFormSubmitted`,
  },
  function NewPassword({ isLoading, showErrors, formSubmitted }) {
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
                <PasswordField
                  path={'user.passwordForm.password'}
                  showErrors={showErrors}
                />
                <ConfirmPasswordField
                  path={'user.passwordForm.confirmPassword'}
                  showErrors
                />
                <Button fluid size="large" color="blue" onClick={handleSubmit}>
                  Update
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
)
