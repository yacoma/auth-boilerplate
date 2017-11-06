import Router from '@cerebral/router'

export default Router({
  routes: [
    {
      path: '/settings/:tab',
      signal: 'app.settingsRouted',
    },
    {
      path: '/:page',
      signal: 'app.pageRouted',
    },
  ],
  allowEscape: true,
})
