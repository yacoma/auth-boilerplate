import * as sequences from './sequences'

import { AuthenticationError } from './errors'
import FormsProvider from '@cerebral/forms'
import HttpProvider from '@cerebral/http'
import { Module } from 'cerebral'
import StorageModule from '@cerebral/storage'
import admin from './modules/admin'
import router from './router'
import settings from './modules/settings'
import user from './modules/user'
import { uuid } from 'uuidv4'

/* istanbul ignore next */
const jwtHeader = localStorage.getItem('jwtHeader')
  ? JSON.parse(localStorage.getItem('jwtHeader'))
  : null

export default (urlParams) =>
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
        flash: urlParams.flash,
        flashType: urlParams.flashType,
        initialFlash: urlParams.flash !== null,
      },
      signals: {
        appMounted: sequences.initialize,
        pageRouted: sequences.routeToPage,
        settingsRouted: sequences.routeToSettings,
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
            Authorization: jwtHeader || '',
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
      catch: [[AuthenticationError, sequences.redirectToLogin]],
    }
  })
