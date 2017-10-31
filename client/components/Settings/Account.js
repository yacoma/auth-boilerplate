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
  Icon,
} from 'semantic-ui-react'
import { PasswordField } from '../fields'
import ConfirmSignOut from './ConfirmSignOut'
import ConfirmRemoveUser from './ConfirmRemoveUser'

export default connect(
  {
    isLoading: state`settings.accountForm.isLoading`,
    showErrors: state`settings.accountForm.showErrors`,
    signOutButtonClicked: signal`settings.signOutButtonClicked`,
    removeUserButtonClicked: signal`settings.removeUserButtonClicked`,
  },
  function UpdateEmail({
    isLoading,
    showErrors,
    signOutButtonClicked,
    removeUserButtonClicked,
  }) {
    return (
      <Grid.Column>
        <Header inverted as="h2" textAlign="center">
          Manage your account
        </Header>
        <Form size="large">
          <Segment>
            <Dimmer inverted active={isLoading}>
              <Loader />
            </Dimmer>
            <Grid container padded divided="vertically" textAlign="center">
              <Grid.Row>
                <Grid.Column>
                  <Message info>
                    <Message.Header>
                      We need your password to verify your identity
                    </Message.Header>
                  </Message>
                  <PasswordField
                    path="settings.accountForm.password"
                    showErrors={showErrors}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Message info>
                    <Message.Header>
                      Dissallow refreshing your current tokens
                    </Message.Header>
                    <p>
                      You can use this when a token or your password gets
                      compromised. Remember also to{' '}
                      <a href="/settings/password">change your password</a>.
                    </p>
                  </Message>
                  <Button
                    icon={<Icon name="sign out" size="large" />}
                    color="yellow"
                    label="Sign-out from all devices"
                    onClick={() => signOutButtonClicked()}
                  />
                  <ConfirmSignOut />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Message negative icon>
                    <Icon name="warning sign" color="orange" />
                    <Message.Content>
                      <Message.Header>Don't do this!</Message.Header>
                      <p>
                        Deleting your account cannot be revoked and all your
                        data will be removed.
                      </p>
                    </Message.Content>
                  </Message>
                  <Button
                    icon={<Icon name="remove user" size="large" />}
                    color="red"
                    label="Delete your user account"
                    onClick={() => removeUserButtonClicked()}
                  />
                  <ConfirmRemoveUser />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Form>
      </Grid.Column>
    )
  }
)
