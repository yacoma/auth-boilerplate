import base64UrlDecode from 'jwt-decode/lib/base64_url_decode'
import { Controller } from 'cerebral'
import Devtools from 'cerebral/devtools'

import app from './app'
import { extractUrlParams } from './utils'

const urlParams = extractUrlParams(['flash', 'flashtype', '@id'])

const controller = Controller(
  app({
    flash: urlParams.flash ? base64UrlDecode(urlParams.flash) : null,
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
