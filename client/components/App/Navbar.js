import React from 'react'
import { connect } from 'cerebral/react'
import { state, signal } from 'cerebral/tags'
import { Menu, Button, Icon } from 'semantic-ui-react'

export default connect(
  {
    currentPage: state`app.currentPage`,
    user: state`user`,
    logoutButtonClicked: signal`user.logoutButtonClicked`,
  },
  function Navbar({ currentPage, user, logoutButtonClicked }) {
    return (
      <Menu attached="top" inverted secondary pointing size="large">
        <Menu.Item name="home" href="/" active={currentPage === null}>
          Home
        </Menu.Item>
        <Menu.Item
          name="private"
          href="/private"
          active={currentPage === 'private'}
        >
          Private
        </Menu.Item>
        <Menu.Menu
          position="right"
          style={{ display: user.authenticated ? 'none' : 'flex' }}
        >
          <Menu.Item name="login" href="/login">
            <Button
              inverted
              compact
              color="yellow"
              active={currentPage === 'login'}
            >
              Log in
            </Button>
          </Menu.Item>
          <Menu.Item name="register" href="/register">
            <Button
              inverted
              compact
              color="blue"
              active={currentPage === 'register'}
            >
              Sign Up
            </Button>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu
          position="right"
          style={{ display: user.authenticated ? 'flex' : 'none' }}
        >
          <Menu.Item
            name="settings"
            href="/settings"
            style={{
              display: user.email !== 'admin@example.com' ? 'flex' : 'none',
            }}
          >
            <Button
              inverted
              compact
              icon
              color="blue"
              active={currentPage === 'settings'}
            >
              <Icon name="user" size="large" />
            </Button>
          </Menu.Item>
          <Menu.Item
            name="admin"
            href="/admin"
            style={{ display: user.isAdmin ? 'flex' : 'none' }}
          >
            <Button
              inverted
              compact
              icon
              color="blue"
              active={currentPage === 'admin'}
            >
              <Icon name="users" size="large" />
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              inverted
              compact
              icon
              color="blue"
              onClick={() => logoutButtonClicked()}
            >
              <Icon name="sign out" size="large" />
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
)
