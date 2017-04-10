import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import {Grid, Header, Segment} from 'semantic-ui-react'

export default connect({
  nickname: state`user.nickname`
},
  function Private ({nickname}) {
    return (
      <Grid stackable padded='vertically' columns={2} centered>
        <Grid.Row>
          <Grid.Column>
            <Header inverted as='h1' textAlign='center' color='blue'>
              Hello {nickname}!
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Segment padded textAlign='left' color='red' size='big'>
              This is the private area for which you have to log in to read it.
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
)
