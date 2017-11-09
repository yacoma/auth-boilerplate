import base64UrlDecode from 'jwt-decode/lib/base64_url_decode'
import uuid from 'uuid'

import { Controller, provide } from 'cerebral'
import Devtools from 'cerebral/devtools'
import HttpProvider from '@cerebral/http'
import FormsProvider from '@cerebral/forms'
import StorageModule from '@cerebral/storage'

import app from './modules/app'
import user from './modules/user'
import admin from './modules/admin'
import settings from './modules/settings'
import router from './router'
import { AuthenticationError } from './modules/common/errors'
import routeToLogin from './modules/common/actions/routeToLogin'
import { extractUrlParams } from './utils'

const jwtHeader = localStorage.getItem('jwtHeader')
  ? JSON.parse(localStorage.getItem('jwtHeader'))
  : null

const urlParams = extractUrlParams(['flash', 'flashtype', '@id'])

const controller = Controller({
  devtools: Devtools({
    host: '127.0.0.1:8585',
    reconnect: false,
  }),
  modules: {
    app: app({
      flash: urlParams['flash'] ? base64UrlDecode(urlParams['flash']) : null,
      flashType: urlParams['flashtype'],
    }),
    user: user({ '@id': urlParams['@id'] }),
    admin,
    settings,
    router,
    storage: StorageModule({ target: localStorage }),
  },
  providers: [
    provide('uuid', () => uuid),
    HttpProvider({
      baseUrl: '/api',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Accept: 'application/json',
        Authorization: jwtHeader,
      },
    }),
    FormsProvider({
      errorMessages: {
        minLength(value, minLength) {
          return `${value} is too short - should be equal or more than ${minLength}`
        },
        isEmail(value) {
          return `${value} is not a valid email`
        },
        equalsField(value, field) {
          return `Not equal to ${field}`
        },
      },
    }),
  ],
  catch: new Map([[AuthenticationError, routeToLogin]]),
})

export default controller
