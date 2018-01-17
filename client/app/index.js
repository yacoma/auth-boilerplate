import uuid from 'uuid'

import { Module } from 'cerebral'
import HttpProvider from '@cerebral/http'
import FormsProvider from '@cerebral/forms'
import StorageModule from '@cerebral/storage'

import user from './modules/user'
import admin from './modules/admin'
import settings from './modules/settings'
import router from './router'
import { AuthenticationError } from './errors'
import routeToLogin from './actions/routeToLogin'
import appMounted from './signals/appMounted'
import pageRouted from './signals/pageRouted'
import settingsRouted from './signals/settingsRouted'

const jwtHeader = localStorage.getItem('jwtHeader')
  ? JSON.parse(localStorage.getItem('jwtHeader'))
  : null

export default urlParams =>
  Module(({ controller, path }) => {
    controller.on('initialized', () => {
      controller.getSignal('appMounted')({})
    })
    return {
      state: {
        currentPage: null,
        lastVisited: null,
        headerText: '',
        headerIcon: null,
        flash: urlParams['flash'],
        flashType: urlParams['flashType'],
        initialFlash: urlParams['flash'] !== null,
      },
      signals: {
        appMounted,
        pageRouted,
        settingsRouted,
      },
      modules: {
        user: user({ '@id': urlParams['@id'] }),
        admin,
        settings,
        router,
        storage: StorageModule({ target: localStorage }),
      },
      providers: {
        uuid,
        http: HttpProvider({
          baseUrl: '/api',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Accept: 'application/json',
            Authorization: jwtHeader,
          },
        }),
        forms: FormsProvider({
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
      },
      catch: [[AuthenticationError, routeToLogin]],
    }
  })
