export function removeUser({ state, storage, http }) {
  storage.remove('jwtHeader')
  http.updateOptions({
    headers: {
      Authorization: '',
    },
  })
  state.set('user.email', '')
  state.set('user.nickname', '')
  state.set('user.isAdmin', false)
  state.set('user.authenticated', false)
  state.set('user.token', {})
  state.set('user.api', {})
}
