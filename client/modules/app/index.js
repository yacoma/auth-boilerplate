import appMounted from './signals/appMounted'

export default (urlParams) => ({controller, path}) => {
  controller.on('initialized', () => {
    controller.getSignal('app.appMounted')({})
  })
  return {
    signals: {
      appMounted
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
