function redirectFactory(page, tab) {
  function redirect({ router, resolve }) {
    if (page === 'settings' && tab) {
      router.redirectToSignal('app.settingsRouted', { tab: resolve.value(tab) })
    } else {
      router.redirectToSignal('app.pageRouted', { page: resolve.value(page) })
    }
  }

  return redirect
}

export default redirectFactory
