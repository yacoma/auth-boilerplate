function redirectFactory(page) {
  function redirect({controller, resolve}) {
    controller.getSignal('app.pageRouted')({page: resolve.value(page)})
  }

  return redirect
}

export default redirectFactory
