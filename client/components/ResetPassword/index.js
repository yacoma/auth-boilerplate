import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Header, Icon, Form, Segment, Button, Dimmer, Loader}
    from 'semantic-ui-react'
import {EmailField} from '../fields'

export default connect({
  emailForm: state`user.emailForm`,
  formSubmitted: signal`user.emailFormSubmitted`
},
  function ResetPassword ({emailForm, formSubmitted}) {
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
              Reset your Password
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
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
        </Grid.Row>
      </Grid>
    )
  }
)
