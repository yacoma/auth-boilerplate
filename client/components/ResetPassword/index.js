import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Header, Icon, Form, Segment, Button, Message, Dimmer, Loader}
    from 'semantic-ui-react'
import {EmailField} from '../fields'

export default connect({
  emailForm: state`user.emailForm`,
  fieldChanged: signal`user.fieldChanged`,
  formSubmitted: signal`user.emailFormSubmitted`
},
  function ResetPassword ({emailForm, fieldChanged, formSubmitted}) {
    const handleSubmit = (event) => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid centered>
        <Grid.Column>
          <Header as='h1' textAlign='center' color='blue' icon>
            <Icon name='user' />
            Reset your Password
          </Header>
          <Message
            warning
            header={emailForm.validationError}
            hidden={!emailForm.validationError}
          />
          <Form size='large'>
            <Segment>
              <Dimmer
                inverted
                active={emailForm.isLoading}
              >
                <Loader />
              </Dimmer>
              <EmailField form={emailForm} path={'user.emailForm.email'} />
              <Button
                fluid size='large'
                color='blue'
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
)
