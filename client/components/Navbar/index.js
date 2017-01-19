import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import {Menu, Container, Button} from 'semantic-ui-react'

export default connect({
  currentPage: state`app.currentPage`,
  isLoggedIn: state`user.isLoggedIn`,
  logoutButtonClicked: signal`user.logoutButtonClicked`
},
  function Navbar ({currentPage, isLoggedIn, logoutButtonClicked}) {
    return (
      <Menu
        attached='top'
        inverted
        secondary
        pointing
        size='large'
      >
        <Container>
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
            <Menu.Item>
              <Button inverted color='blue'
                onClick={() => logoutButtonClicked()}
              >
                Log out
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
)
