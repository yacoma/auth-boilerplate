import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Menu, Button, Icon} from 'semantic-ui-react'

export default connect({
  currentPage: state`app.currentPage`,
  isLoggedIn: state`user.isLoggedIn`,
  isAdmin: state`user.isAdmin`,
  nickname: state`user.nickname`,
  logoutButtonClicked: signal`user.logoutButtonClicked`
},
  function Navbar ({currentPage, isLoggedIn, isAdmin, nickname, logoutButtonClicked}) {
    return (
      <Menu
        attached='top'
        inverted
        secondary
        pointing
        size='large'
      >
        <Menu.Item name='home' href='/'
          active={currentPage === null}
        >
          Home
        </Menu.Item>
        <Menu.Item name='private' href='/private'
          active={currentPage === 'private'}
        >
          Private
        </Menu.Item>
        <Menu.Menu position='right'
          style={{display: isLoggedIn ? 'none' : 'flex'}}
        >
          <Menu.Item name='login' href='/login'>
            <Button inverted color='yellow'
              active={currentPage === 'login'}
            >
              Log in
            </Button>
          </Menu.Item>
          <Menu.Item name='register' href='/register'>
            <Button inverted color='blue'
              active={currentPage === 'register'}
            >
              Sign Up
            </Button>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position='right'
          style={{display: isLoggedIn ? 'flex' : 'none'}}
        >
          <Menu.Item name='settings' href='/settings'
            style={{display: nickname !== 'Admin' ? 'flex' : 'none'}}
          >
            <Button inverted color='blue'
              icon={<Icon name='user' size='large' />}
              active={currentPage === 'settings'}
            />
          </Menu.Item>
          <Menu.Item name='admin' href='/admin'
            style={{display: isAdmin ? 'flex' : 'none'}}
          >
            <Button inverted color='blue'
              icon={<Icon name='users' size='large' />}
              active={currentPage === 'admin'}
            />
          </Menu.Item>
          <Menu.Item>
            <Button inverted color='blue'
              onClick={() => logoutButtonClicked()}
            >
              Log out
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
)
