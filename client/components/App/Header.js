import React from 'react'
import { connect } from '@cerebral/react'
import { state } from 'cerebral/tags'
import { Grid, Header, Icon } from 'semantic-ui-react'

export default connect(
  {
    headerText: state`headerText`,
    headerIcon: state`headerIcon`,
  },
  function PageHeader({ headerText, headerIcon }) {
    return (
      <Grid stackable padded="vertically" columns={2} centered>
        <Grid.Row>
          <Grid.Column>
            <Header
              inverted
              as="h1"
              textAlign="center"
              color="blue"
              icon={!!headerIcon}
            >
              {!!headerIcon && <Icon name={headerIcon} />}
              {headerText}
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
)
