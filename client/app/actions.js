import jwtDecode from 'jwt-decode'

import { AuthenticationError } from './errors'

export function authenticate({ state }) {
  if (!state.get('user.authenticated')) {
    throw new AuthenticationError('You must log in to view this page')
  }
}

export function authenticateAdmin({ state }) {
  if (!state.get('user.authenticated') || !state.get('user.isAdmin')) {
    throw new AuthenticationError(
      'You need Admin permissions to view this page'
    )
  }
}

export function initApp({ state, storage }) {
  const jwtHeader = storage.get('jwtHeader')
  if (jwtHeader) {
    const claims = jwtDecode(jwtHeader)
    if (!claims.exp || claims.exp * 1000 > Date.now()) {
      state.set('user.authenticated', true)
      state.set('user.api.@id', claims.uid)
      state.set('user.email', claims.sub)
      state.set('user.nickname', claims.nickname)
      state.set('user.isAdmin', claims.isAdmin)
      if (claims.exp) {
        state.set('user.token.exp', claims.exp)
        claims.refresh_until &&
          state.set('user.token.refreshUntil', claims.refresh_until)
      }
    } else if (
      !claims.refresh_until ||
      claims.refresh_until * 1000 > Date.now()
    ) {
      state.set('user.token.shouldRefresh', true)
    } else {
      storage.remove('jwtHeader')
    }
  }
}

export function getSchemaValidationErrorMessages({ props }) {
  const errorMessages = Object.keys(props.error.response.result).reduce(
    (errorMessages, errorField) => {
      if (Array.isArray(props.error.response.result[errorField])) {
        errorMessages.push(
          errorField + ': ' + props.error.response.result[errorField].join(', ')
        )
      }
      return errorMessages
    },
    []
  )
  return { errorMessages: errorMessages.join('\n') }
}
