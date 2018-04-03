import React from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  Dimmer,
  Message,
  Loader,
  List,
} from 'semantic-ui-react'
import { PasswordField, EmailField } from '../fields'

export default connect(
  {
    isLoading: state`settings.emailForm.isLoading`,
    showErrors: state`settings.emailForm.showErrors`,
    currentEmail: state`user.email`,
    formSubmitted: signal`settings.emailFormSubmitted`,
  },
  function UpdateEmail({ isLoading, showErrors, currentEmail, formSubmitted }) {
    const handleSubmit = (event) => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid.Column>
        <Header inverted as="h2" textAlign="center">
          Update your email
        </Header>
        <Form size="large">
          <Segment>
            <Dimmer inverted active={isLoading}>
              <Loader />
            </Dimmer>
            <Message info>
              <Message.Header>
                Your email address will be updated immediately
              </Message.Header>
              <p>
                Remember to confirm the new email if you want to be able to
                reset your password.
              </p>
            </Message>
            <List relaxed>
              <List.Item>
                <List.Header as="h4">Current email address</List.Header>
                <List.Icon name="mail" color="blue" />
                <List.Content>{currentEmail}</List.Content>
              </List.Item>
              <List.Item>
                <List.Header as="h4">
                  We need your password to verify your identity
                </List.Header>
                <PasswordField
                  path="settings.emailForm.password"
                  showErrors={showErrors}
                />
              </List.Item>
              <List.Item>
                <List.Header as="h4">New email adress</List.Header>
                <EmailField
                  path="settings.emailForm.email"
                  showErrors={showErrors}
                />
              </List.Item>
            </List>
            <Button fluid size="large" color="blue" onClick={handleSubmit}>
              Update email
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    )
  }
)
