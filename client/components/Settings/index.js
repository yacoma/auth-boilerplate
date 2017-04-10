import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import {Grid, Header, Icon, Menu} from 'semantic-ui-react'
import Profile from './Profile'
import Email from './Email'
import Password from './Password'

const tabs = {
  profile: Profile,
  email: Email,
  password: Password
}

export default connect({
  nickname: state`user.nickname`,
  currentTab: state`settings.currentTab`
},
  function Settings ({nickname, currentTab}) {
    const Tab = tabs[currentTab]
    return (
      <Grid container stackable padded='vertically' centered>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header inverted as='h1' textAlign='center' color='blue' icon>
              <Icon name='user' />
              {nickname}'s settings
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={4} centered>
          <Grid.Column>
            <Menu
              attached='top'
              inverted
              secondary
              pointing
              compact
              size='large'
            >
              <Menu.Item name='home' href='/settings/profile'
                active={currentTab === 'profile'}
              >
                Profile
              </Menu.Item>
              <Menu.Item name='home' href='/settings/email'
                active={currentTab === 'email'}
              >
                E-mail
              </Menu.Item>
              <Menu.Item name='home' href='/settings/password'
                active={currentTab === 'password'}
              >
                Password
              </Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} centered>
          <Tab />
        </Grid.Row>
      </Grid>
    )
  }
)
