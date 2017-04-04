import React from 'react'
import { Grid, Header, Segment } from 'semantic-ui-react'

export default function Home () {
  return (
    <Grid container stackable padded='vertically' columns={2} centered>
      <Grid.Column>
        <Header as='h1' textAlign='center' color='blue'>
          Auth Boilerplate
        </Header>
        <Segment padded size='big'>
          <p>
            This is a a authentication boilerplate, which uses Morepath
            as a REST back-end and Cerebral as front-end.
          </p>
          <p>
            Please feel free to play around, register and sign in. For trying
            out the User Admin panel you have to sign in with Admin permissions.
          </p>
          <p>
            Just sign in with the email address <em>admin@example.com</em> and
            the password <em>admin0</em>. In the Admin panel you can give Admin
            permissions also to other users.
          </p>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}
