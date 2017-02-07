import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import Navbar from '../Navbar'
import Home from '../Home'
import Private from '../Private'
import Login from '../Login'
import Register from '../Register'
import Flash from '../Flash'

const pages = {
  home: Home,
  private: Private,
  login: Login,
  register: Register
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
