import base64UrlDecode from 'jwt-decode/lib/base64_url_decode'

import {Controller} from 'cerebral'
import {props} from 'cerebral/tags'
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'
import HttpProvider from 'cerebral-provider-http'

import App from './modules/app'
import User from './modules/user'
import Admin from './modules/admin'

const jwtHeader = localStorage.getItem('jwtHeader')
  ? JSON.parse(localStorage.getItem('jwtHeader'))
  : null

function getUrlParams (keys) {
  const urlParams = new URLSearchParams(location.search)
  let urlParamsChanged = false
  const params = keys.reduce((params, key) => {
    if (urlParams.has(key)) {
      params[key] = urlParams.get(key)
      urlParams.delete(key)
      urlParamsChanged = true
    } else {
      params[key] = null
    }
    return params
  }, {})
  if (urlParamsChanged) {
    history.replaceState({}, '', `${location.pathname}?${urlParams}`)
  }
  return params
}

const urlParams = getUrlParams(['flash', 'flashtype', '@id'])

const controller = Controller({
  devtools: Devtools({
    remoteDebugger: '127.0.0.1:8585'
  }),
  modules: {
    app: App({
      'flash': urlParams['flash'] ? base64UrlDecode(urlParams['flash']) : null,
      'flashType': urlParams['flashtype']
    }),
    user: User({'@id': urlParams['@id']}),
    admin: Admin,
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
