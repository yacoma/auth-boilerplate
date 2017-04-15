import jwtDecode from 'jwt-decode'

function initApp ({state, storage}) {
  const jwtHeader = storage.get('jwtHeader')
  if (jwtHeader) {
    const claims = jwtDecode(jwtHeader)
    if (!claims.exp || (claims.exp * 1000 > Date.now())) {
      state.set('user.authenticated', true)
      state.set('user.api.@id', claims.uid)
      state.set('user.email', claims.sub)
      state.set('user.nickname', claims.nickname)
      state.set('user.isAdmin', claims.isAdmin)
      if (claims.exp) {
        state.set('user.token.exp', claims.exp)
        claims.refresh_until && state.set('user.token.refreshUntil', claims.refresh_until)
      }
    } else if (!claims.refresh_until || (claims.refresh_until * 1000 > Date.now())) {
      state.set('user.token.shouldRefresh', true)
    } else {
      storage.remove('jwtHeader')
    }
  }
}

export default initApp
