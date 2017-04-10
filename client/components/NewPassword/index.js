import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Header, Icon, Form, Segment, Button, Dimmer, Loader}
    from 'semantic-ui-react'
import {PasswordField, ConfirmPasswordField} from '../fields'

export default connect({
  passwordForm: state`user.passwordForm`,
  formSubmitted: signal`user.passwordFormSubmitted`
},
  function NewPassword ({passwordForm, formSubmitted}) {
    const handleSubmit = (event) => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid stackable padded='vertically' columns={2} centered>
        <Grid.Row>
          <Grid.Column>
            <Header inverted as='h1' textAlign='center' color='blue' icon>
              <Icon name='user' />
              New Password
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form size='large'>
              <Segment>
                <Dimmer
                  inverted
                  active={passwordForm.isLoading}
                >
                  <Loader />
                </Dimmer>
                <PasswordField form={passwordForm} path={'user.passwordForm.password'} />
                <ConfirmPasswordField form={passwordForm} path={'user.passwordForm.confirmPassword'} />
                <Button
                  fluid size='large'
                  color='blue'
                  onClick={handleSubmit}
                >
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
