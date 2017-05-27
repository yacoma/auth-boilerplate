import React from 'react'
import { Grid, Segment } from 'semantic-ui-react'

export default function Private() {
  return (
    <Grid stackable padded="vertically" columns={2} centered>
      <Grid.Row>
        <Grid.Column>
          <Segment padded textAlign="left" color="red" size="big">
            This is the private area for which you have to log in to read it.
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
