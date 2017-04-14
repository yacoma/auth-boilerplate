import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Grid, Header, Form, Segment, Button, Dimmer, Loader, List}
    from 'semantic-ui-react'
import {NicknameField} from '../fields'

export default connect({
  profileForm: state`settings.profileForm`,
  formSubmitted: signal`settings.profileFormSubmitted`
},
  function EditProfile ({profileForm, formSubmitted}) {
    const handleSubmit = (event) => {
      event.preventDefault()
      formSubmitted()
    }
    return (
      <Grid.Column>
        <Header inverted as='h2' textAlign='center'>
          Edit your profile
        </Header>
        <Form size='large'>
          <Segment>
            <Dimmer
              inverted
              active={profileForm.isLoading}
            >
              <Loader />
            </Dimmer>
            <List relaxed>
              <List.Item>
                <List.Header as='h4'>
                  Nickname
                </List.Header>
                <NicknameField form={profileForm} path={'settings.profileForm.nickname'} />
              </List.Item>
            </List>
            <Button
              fluid size='large'
              color='blue'
              onClick={handleSubmit}
            >
              Save profile
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    )
  }
)
