import jwtDecode from 'jwt-decode'

export default [
  function initUser ({input, state}) {
    const jwtHeader = input.headers.authorization
    const claims = jwtDecode(jwtHeader)
    localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))
    state.set('user.isLoggedIn', true)
    state.set('user.api.@id', input.result['@id'])
    state.set('user.api.@type', input.result['@type'])
    state.set('user.email', claims.sub)
    state.set('user.nickname', claims.nickname)
    state.set('user.language', claims.language)
    state.set('user.isAdmin', claims.isAdmin)
    state.set('user.token.exp', claims.exp)
  }
]
