import React from 'react'
import {connect} from 'cerebral/react'
import Navbar from '../Navbar'
import Home from '../Home'
import Private from '../Private'
import Login from '../Login'
import Register from '../Register'

const pages = {
  home: Home,
  private: Private,
  login: Login,
  register: Register
}

export default connect({
  currentPage: 'app.currentPage'
},
  function App (props) {
    const Page = pages[props.currentPage || 'home']

    return (
      <div>
        <Navbar />
        <Page />
      </div>
    )
  }
)
