import jwtDecode from 'jwt-decode'

function initUser({ props, state, storage, http }) {
  const jwtHeader = props.headers.authorization
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

export default initUser
