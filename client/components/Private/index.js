import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import {Grid, Header, Segment} from 'semantic-ui-react'

export default connect({
  nickname: state`user.nickname`
},
  function Private ({nickname}) {
    return (
      <Grid container stackable padded='vertically' columns={2} centered>
        <Grid.Column>
          <Header as='h1' textAlign='center' color='blue'>
            Hello {nickname}!
          </Header>
          <Segment padded textAlign='left' color='red' size='big'>
            This is the private area for which you have to log in to read it.
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
)
