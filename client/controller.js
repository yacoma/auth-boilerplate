import { Controller } from 'cerebral'
import Devtools from 'cerebral/devtools'
import app from './app'
import base64url from 'base64url'
import { extractUrlParams } from './utils'

const urlParams = extractUrlParams(['flash', 'flashtype', '@id'])

const controller = Controller(
  app({
    flash: urlParams.flash ? base64url.decode(urlParams.flash) : null,
    flashType: urlParams.flashtype,
  }),
  {
    devtools: Devtools({
      host: '127.0.0.1:8585',
      reconnect: false,
    }),
    throwToConsole: false,
  }
)

export default controller
