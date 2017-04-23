function mergeUsers({props, state, uuid}) {
  if (props.result.users && props.result.users.length !== 0) {
    let orderKey = 1
    for (const user of props.result.users) {
      user['orderKey'] = orderKey
      const usersInState = state.get('admin.users')
      const uidInState = Object.keys(usersInState).filter(uid => {
        return usersInState[uid]['email'] === user['email']
      })[0]
      if (uidInState) {
        state.merge(`admin.users.${uidInState}`, user)
      } else {
        state.set(`admin.users.${uuid()}`, user)
      }
      orderKey++
    }
  } else {
    return {noUsersFound: true}
  }
}

export default mergeUsers
