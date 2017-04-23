import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import {Grid, Menu} from 'semantic-ui-react'
import Profile from './Profile'
import Email from './Email'
import Password from './Password'
import Account from './Account'

const tabs = {
  profile: Profile,
  email: Email,
  password: Password,
  account: Account,
}

export default connect(
  {
    nickname: state`user.nickname`,
    currentTab: state`settings.currentTab`,
  },
  function Settings({nickname, currentTab}) {
    const Tab = tabs[currentTab]
    return (
      <Grid container stackable padded="vertically" centered>
        <Grid.Row columns={3} centered>
          <Grid.Column>
            <Menu
              attached="top"
              inverted
              secondary
              pointing
              compact
              size="large"
            >
              <Menu.Item
                name="profile"
                href="/settings/profile"
                active={currentTab === 'profile'}
              >
                Profile
              </Menu.Item>
              <Menu.Item
                name="email"
                href="/settings/email"
                active={currentTab === 'email'}
              >
                E-mail
              </Menu.Item>
              <Menu.Item
                name="password"
                href="/settings/password"
                active={currentTab === 'password'}
              >
                Password
              </Menu.Item>
              <Menu.Item
                name="account"
                href="/settings/account"
                active={currentTab === 'account'}
              >
                Account
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
