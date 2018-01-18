import jwtDecode from 'jwt-decode'

export function initUser({ props, state, storage, http }) {
  const jwtHeader = props.response.headers.authorization
  const claims = jwtDecode(jwtHeader)
  storage.set('jwtHeader', jwtHeader)
  http.updateOptions({
    headers: {
      Authorization: jwtHeader,
    },
  })
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
}

export function removeUser({ state, storage, http }) {
  storage.remove('jwtHeader')
  http.updateOptions({
    headers: {
      Authorization: null,
    },
  })
  state.set('user.email', '')
  state.set('user.nickname', '')
  state.set('user.isAdmin', false)
  state.set('user.authenticated', false)
  state.set('user.token', {})
  state.set('user.api', {})
}
