import { sequence } from 'cerebral'
import { state, props } from 'cerebral/tags'
import { setField } from '@cerebral/forms/operators'

export default sequence('Change field', [
  setField(state`${props`field`}`, props`value`),
])
