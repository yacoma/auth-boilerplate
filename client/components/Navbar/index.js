import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import {Menu, Container, Button} from 'semantic-ui-react'

export default connect({
  currentPage: state`app.currentPage`
},
  function Navbar ({currentPage}) {
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
          <Menu.Menu position='right'>
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
        </Container>
      </Menu>
    )
  }
)
