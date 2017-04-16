import {sequence} from 'cerebral'
import {props} from 'cerebral/tags'
import routeTo from '../../common/factories/routeTo'

export default sequence('Route to settings tab', [
  routeTo('settings', props`tab`)
])
