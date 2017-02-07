import {Controller} from 'cerebral'
import {props} from 'cerebral/tags'
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'
import HttpProvider from 'cerebral-provider-http'

import App from './modules/app'
import User from './modules/user'

const jwtHeader = localStorage.getItem('jwtHeader')
  ? JSON.parse(localStorage.getItem('jwtHeader'))
  : null

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools(),
  modules: {
    app: App,
    user: User,
    router: Router({
      filterFalsy: true,
      routes: [
        {
          path: '/:page?',
          map: {page: props`page`},
          signal: 'app.pageRouted'
        }
      ]
    })
  },
  providers: [
    HttpProvider({
      baseUrl: '/api',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
        'Authorization': jwtHeader
      }
    })
  ]
})

export default controller
