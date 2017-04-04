import appMounted from './signals/appMounted'
import pageRouted from './signals/pageRouted'

export default (urlParams) => ({controller, path}) => {
  controller.on('initialized', () => {
    controller.getSignal('app.appMounted')({})
  })
  return {
    signals: {
      appMounted,
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
