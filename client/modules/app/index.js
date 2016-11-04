import routeTo from './chains/routeTo'

export default {
  state: {
    currentPage: null,
    lastVisited: null
  },
  signals: {
    pageRouted: routeTo
  }
}
