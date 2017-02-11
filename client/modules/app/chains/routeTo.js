import {props} from 'cerebral/tags'
import routeTo from '../factories/routeTo'

export default [
  ...routeTo(props`page`)
]
