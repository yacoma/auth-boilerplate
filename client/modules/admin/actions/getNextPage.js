function getNextPage({props, state}) {
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
  return {nextPage}
}

export default getNextPage
