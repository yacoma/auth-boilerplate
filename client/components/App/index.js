import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import Navbar from '../Navbar'
import Flash from '../Flash'
import Home from '../Home'
import Private from '../Private'
import Login from '../Login'
import Register from '../Register'
import ResetPassword from '../ResetPassword'
import NewPassword from '../NewPassword'

const pages = {
  home: Home,
  private: Private,
  login: Login,
  register: Register,
  reset: ResetPassword,
  newpassword: NewPassword
}

export default connect({
  currentPage: state`app.currentPage`
},
  function App ({currentPage}) {
    const Page = pages[currentPage || 'home']

    return (
      <div>
        <Navbar />
        <Flash />
        <Page />
      </div>
    )
  }
)
