import React from 'react'
import { connect } from 'cerebral/react'
import { state, signal } from 'cerebral/tags'
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  Dimmer,
  Loader,
  List,
} from 'semantic-ui-react'
import {
  CurrentPasswordField,
  PasswordField,
  ConfirmPasswordField,
} from '../fields'

export default connect(
  {
    isLoading: state`settings.passwordForm.isLoading`,
    showErrors: state`settings.passwordForm.showErrors`,
    formSubmitted: signal`settings.passwordFormSubmitted`,
  },
  function ChangePassword({
    isLoading,
    showErrors,
    currentEmail,
    formSubmitted,
  }) {
    const handleSubmit = event => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid.Column>
        <Header inverted as="h2" textAlign="center">
          Change your password
        </Header>
        <Form size="large">
          <Segment>
            <Dimmer inverted active={isLoading}>
              <Loader />
            </Dimmer>
            <List relaxed>
              <List.Item>
                <List.Header as="h4">
                  Current password
                </List.Header>
                <CurrentPasswordField
                  path={'settings.passwordForm.currentPassword'}
                  showErrors={showErrors}
                />
              </List.Item>
              <List.Item>
                <List.Header as="h4">
                  New password
                </List.Header>
                <PasswordField
                  path={'settings.passwordForm.password'}
                  showErrors={showErrors}
                />
              </List.Item>
              <List.Item>
                <List.Header as="h4">
                  Confirm new password
                </List.Header>
                <ConfirmPasswordField
                  path={'settings.passwordForm.confirmPassword'}
                  showErrors={showErrors}
                />
              </List.Item>
            </List>
            <Button fluid size="large" color="blue" onClick={handleSubmit}>
              Change password
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    )
  }
)
