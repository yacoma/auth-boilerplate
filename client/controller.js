import base64UrlDecode from 'jwt-decode/lib/base64_url_decode'

import {Controller} from 'cerebral'
import {props} from 'cerebral/tags'
import Devtools from 'cerebral/devtools'
import Router from 'cerebral-router'
import HttpProvider from 'cerebral-provider-http'
import FormsProvider from 'cerebral-provider-forms'
import StorageProvider from 'cerebral-provider-storage'
import {ContextProvider} from 'cerebral/providers'
import uuid from 'uuid'

import App from './modules/app'
import User from './modules/user'
import Admin from './modules/admin'

const jwtHeader = localStorage.getItem('jwtHeader')
  ? JSON.parse(localStorage.getItem('jwtHeader'))
  : null

/**
 * Extract URL search params from query string and remove
 * extracted parameters from URL in current page
 * @param {string[]} keys - Array of query keys to extract
 * @returns {Object} - Object with keys and extracted values.
 *  If the key was not found the value is set to null.
 */
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
    }),
    FormsProvider({
      errorMessages: {
        minLength (value, minLength) {
          return `${value} is too short - should be equal or more than ${minLength}`
        },
        isEmail (value) {
          return `${value} is not a valid email`
        },
        equalsField (value, field) {
          return `Not equal to ${field}`
        }
      }
    }),
    StorageProvider({target: localStorage}),
    ContextProvider({uuid})
  ]
})

export default controller
