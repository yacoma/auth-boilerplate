import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Header, Form, Segment, Button, Dimmer, Loader, List}
    from 'semantic-ui-react'
import {CurrentPasswordField, PasswordField, ConfirmPasswordField} from '../fields'

export default connect({
  passwordForm: state`settings.passwordForm`,
  formSubmitted: signal`settings.passwordFormSubmitted`
},
  function ChangePassword ({passwordForm, formSubmitted}) {
    const handleSubmit = (event) => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid.Column>
        <Header inverted as='h2' textAlign='center'>
          Change your password
        </Header>
        <Form size='large'>
          <Segment>
            <Dimmer
              inverted
              active={passwordForm.isLoading}
            >
              <Loader />
            </Dimmer>
            <List relaxed>
              <List.Item>
                <List.Header>
                  Current password
                </List.Header>
                <CurrentPasswordField
                  form={passwordForm}
                  path={'settings.passwordForm.currentPassword'}
                />
              </List.Item>
              <List.Item>
                <List.Header>
                  New password
                </List.Header>
                <PasswordField
                  form={passwordForm}
                  path={'settings.passwordForm.password'}
                />
              </List.Item>
              <List.Item>
                <List.Header>
                  Confirm new password
                </List.Header>
                <ConfirmPasswordField
                  form={passwordForm}
                  path={'settings.passwordForm.confirmPassword'}
                />
              </List.Item>
            </List>
            <Button
              fluid size='large'
              color='blue'
              onClick={handleSubmit}
            >
              Change password
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    )
  }
)
