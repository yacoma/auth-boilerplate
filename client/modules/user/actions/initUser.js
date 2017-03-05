import jwtDecode from 'jwt-decode'

function initUser ({props, state}) {
  const jwtHeader = props.headers.authorization
  const claims = jwtDecode(jwtHeader)
  localStorage.setItem('jwtHeader', JSON.stringify(jwtHeader))
  state.set('user.isLoggedIn', true)
  state.set('user.api.@id', props.result['@id'])
  state.set('user.api.@type', props.result['@type'])
  state.set('user.email', claims.sub)
  state.set('user.nickname', claims.nickname)
  state.set('user.language', claims.language)
  state.set('user.isAdmin', claims.isAdmin)
  state.set('user.token.exp', claims.exp)
  state.set('user.token.refresh_until', claims.refresh_until)
}

export default initUser
