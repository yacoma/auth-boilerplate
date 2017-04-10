import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import {Container} from 'semantic-ui-react'
import Navbar from '../Navbar'
import Flash from '../Flash'
import Home from '../Home'
import Private from '../Private'
import Login from '../Login'
import Register from '../Register'
import ResetPassword from '../ResetPassword'
import NewPassword from '../NewPassword'
import Admin from '../Admin'
import Settings from '../Settings'

const pages = {
  home: Home,
  private: Private,
  login: Login,
  register: Register,
  reset: ResetPassword,
  newpassword: NewPassword,
  admin: Admin,
  settings: Settings
}

export default connect({
  currentPage: state`app.currentPage`
},
  function App ({currentPage}) {
    const Page = pages[currentPage || 'home']

    return (
      <Container>
        <Navbar />
        <Flash />
        <Page />
      </Container>
    )
  }
)
