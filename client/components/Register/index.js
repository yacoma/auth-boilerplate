import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Header, Icon, Form, Segment, Button, Dimmer, Loader}
    from 'semantic-ui-react'
import {NicknameField, EmailField, PasswordField, ConfirmPasswordField} from '../fields'

export default connect({
  register: state`user.register`,
  formSubmitted: signal`user.registerFormSubmitted`
},
  function Register ({register, formSubmitted}) {
    const handleSubmit = (event) => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid container stackable padded='vertically' columns={2} centered>
        <Grid.Column>
          <Header as='h1' textAlign='center' color='blue' icon>
            <Icon name='user' />
            Create account
          </Header>
          <Form size='large'>
            <Segment>
              <Dimmer
                inverted
                active={register.isLoading}
              >
                <Loader />
              </Dimmer>
              <NicknameField form={register} path={'user.register.nickname'} />
              <EmailField form={register} path={'user.register.email'} />
              <PasswordField form={register} path={'user.register.password'} />
              <ConfirmPasswordField form={register} path={'user.register.confirmPassword'} />
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
      </Grid>
    )
  }
)
