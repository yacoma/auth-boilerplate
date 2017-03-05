function removeUser ({state}) {
  localStorage.removeItem('jwtHeader')
  state.set('user.email', '')
  state.set('user.nickname', '')
  state.set('user.language', '')
  state.set('user.isAdmin', false)
  state.set('user.isLoggedIn', false)
  state.set('user.token', {})
  state.set('user.api', {})
}

export default removeUser
