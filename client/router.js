import Router from '@cerebral/router'
import { props } from 'cerebral/tags'

export default Router({
  filterFalsy: true,
  routes: [
    {
      path: '/settings/:tab?',
      map: { tab: props`tab` },
      signal: 'app.settingsRouted',
    },
    {
      path: '/:page?',
      map: { page: props`page` },
      signal: 'app.pageRouted',
    },
  ],
})
