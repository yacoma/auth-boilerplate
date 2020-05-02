export function mergeUsers({ props, state, uuid }) {
  if (props.response.result.users && props.response.result.users.length !== 0) {
    let orderKey = 1
    for (const user of props.response.result.users) {
      user.orderKey = orderKey
      const usersInState = state.get('admin.users')
      const uidInState = Object.keys(usersInState).filter((uid) => {
        return usersInState[uid].email === user.email
      })[0]
      if (uidInState) {
        state.merge(`admin.users.${uidInState}`, user)
      } else {
        state.set(`admin.users.${uuid}`, user)
      }
      orderKey++
    }
  } else {
    return { noUsersFound: true }
  }
}

export function getNextPage({ props, state }) {
  let nextPage = 1
  switch (props.nextPage) {
    case 'previous':
      nextPage = parseInt(state.get('admin.currentPage')) - 1
      break
    case 'next':
      nextPage = parseInt(state.get('admin.currentPage')) + 1
      break
    case 'last':
      nextPage = state.get('admin.pages')
      break
    default:
      if (typeof props.nextPage === 'number') {
        nextPage = Math.floor(props.nextPage)
      }
  }
  return { nextPage }
}
