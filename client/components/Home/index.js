import React from 'react'
import { Grid, Header, Segment } from 'semantic-ui-react'

export default function Home () {
  return (
    <Grid centered>
      <Grid.Column>
        <Header as='h1' textAlign='center' color='blue'>
          Auth Boilerplate
        </Header>
        <Segment padded size='big'>
          This is a a authentication boilerplate, which uses Morepath
          as a REST back-end and Cerebral as front-end.
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
