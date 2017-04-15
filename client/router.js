import Router from 'cerebral-router'
import {props} from 'cerebral/tags'
import routeTo from 'modules/common/factories/routeTo'

export default Router({
  filterFalsy: true,
  routes: [{
    path: '/settings/:tab?',
    map: {tab: props`tab`},
    signal: routeTo('settings', props`tab`)
  }, {
    path: '/:page?',
    map: {page: props`page`},
    signal: routeTo(props`page`)
  }]
})
