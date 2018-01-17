import Router from '@cerebral/router'

export default Router({
  routes: [
    {
      path: '/settings/:tab',
      signal: 'settingsRouted',
    },
    {
      path: '/:page',
      signal: 'pageRouted',
    },
  ],
  allowEscape: true,
})
