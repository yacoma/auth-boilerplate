import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Form, Segment, Button, Dimmer, Loader}
    from 'semantic-ui-react'
import {NicknameField, EmailField, PasswordField, ConfirmPasswordField} from '../fields'

export default connect({
  registerForm: state`user.registerForm`,
  formSubmitted: signal`user.registerFormSubmitted`
},
  function Register ({registerForm, formSubmitted}) {
    const handleSubmit = (event) => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid stackable padded='vertically' columns={2} centered>
        <Grid.Row>
          <Grid.Column>
            <Form size='large'>
              <Segment>
                <Dimmer
                  inverted
                  active={registerForm.isLoading}
                >
                  <Loader />
                </Dimmer>
                <NicknameField form={registerForm} path={'user.registerForm.nickname'} />
                <EmailField form={registerForm} path={'user.registerForm.email'} />
                <PasswordField form={registerForm} path={'user.registerForm.password'} />
                <ConfirmPasswordField form={registerForm} path={'user.registerForm.confirmPassword'} />
                <Button
                  fluid size='large'
                  color='blue'
                  onClick={handleSubmit}
                >
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
