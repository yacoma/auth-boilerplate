import {state, props} from 'cerebral/tags'
import {setField} from 'cerebral-provider-forms/operators'

export default [
  setField(state`${props`field`}`, props`value`)
]
