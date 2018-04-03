import React from 'react'
import { connect } from '@cerebral/react'
import { state, signal } from 'cerebral/tags'
import { Grid, Form, Segment, Button, Dimmer, Loader } from 'semantic-ui-react'
import { EmailField } from '../fields'

export default connect(
  {
    isLoading: state`user.emailForm.isLoading`,
    showErrors: state`user.emailForm.showErrors`,
    formSubmitted: signal`user.emailFormSubmitted`,
  },
  function ResetPassword({ isLoading, showErrors, formSubmitted }) {
    const handleSubmit = (event) => {
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
                <EmailField
                  path="user.emailForm.email"
                  showErrors={showErrors}
                />
                <Button fluid size="large" color="blue" onClick={handleSubmit}>
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
