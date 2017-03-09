import pageRouted from './signals/pageRouted'

export default (urlParams) => ({controller, path}) => {
  return {
    signals: {
      pageRouted
    },
    state: {
      currentPage: null,
      lastVisited: null,
      flash: urlParams['flash'],
      flashType: urlParams['flashType'],
      initialFlash: urlParams['flash'] !== null
    }
  }
}
