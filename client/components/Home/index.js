import React from 'react'
import { Grid, Segment, Icon } from 'semantic-ui-react'

export default function Home() {
  return (
    <Grid stackable padded="vertically" columns={2} centered>
      <Grid.Row>
        <Grid.Column>
          <Segment padded size="big">
            <p>
              This is an authentication boilerplate, which uses Morepath as a
              REST back-end and Cerebral as front-end.
            </p>
            <p>
              Please feel free to play around, register and sign in. For trying
              out the User Admin panel you have to sign in with Admin
              permissions.
            </p>
            <p>
              Just sign in with the email address <em>admin@example.com</em> and
              the password <em>admin0</em>
              . In the Admin panel you can give Admin permissions also to other
              users.
            </p>
            <p>
              For some insides take a look at
              <a href="http://auth-boilerplate.readthedocs.io" target="_blank">
                <Icon name="book" size="large" />
              </a>.<br />
              You can examine the code at
              <a
                href="https://github.com/yacoma/auth-boilerplate"
                target="_blank"
              >
                <Icon name="github alternate" size="large" />
              </a>.
            </p>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}
