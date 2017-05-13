function redirectFactory(page, tab) {
  function redirect({controller, resolve}) {
    if (page === 'settings' && tab) {
      controller.getSignal('app.settingsRouted')({tab: resolve.value(tab)})
    } else {
      controller.getSignal('app.pageRouted')({page: resolve.value(page)})
    }
  }

  return redirect
}

export default redirectFactory
