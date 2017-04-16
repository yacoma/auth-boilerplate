import appMounted from './signals/appMounted'
import pageRouted from './signals/pageRouted'
import settingsRouted from './signals/settingsRouted'

export default (urlParams) => ({controller, path}) => {
  controller.on('initialized', () => {
    controller.getSignal('app.appMounted')({})
  })
  return {
    signals: {
      appMounted,
      pageRouted,
      settingsRouted
    },
    state: {
      currentPage: null,
      lastVisited: null,
      headerText: '',
      headerIcon: null,
      flash: urlParams['flash'],
      flashType: urlParams['flashType'],
      initialFlash: urlParams['flash'] !== null
    }
  }
}
