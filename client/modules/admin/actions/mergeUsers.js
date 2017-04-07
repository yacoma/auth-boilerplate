function mergeUsers ({props, state, uuid}) {
  if (props.result.users && props.result.users.length !== 0) {
    let orderKey = 1
    for (const user of props.result.users) {
      user['orderKey'] = orderKey
      const usersLoaded = state.get('admin.users')
      const uidLoaded = Object.keys(usersLoaded).filter(uid => {
        return usersLoaded[uid]['email'] === user['email']
      })
      if (uidLoaded[0]) {
        state.merge(`admin.users.${uidLoaded[0]}`, user)
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
