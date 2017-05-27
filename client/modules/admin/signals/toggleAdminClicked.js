import { sequence } from 'cerebral'
import { state, string, props } from 'cerebral/tags'
import { set, when } from 'cerebral/operators'
import { httpPut } from '@cerebral/http/operators'
import showValidationError from '../../common/factories/showValidationError'

export default sequence('Toggle Admin permissions', [
  set(state`admin.users.${props`uid`}.toggleAdminIsLoading`, true),
  when(state`admin.users.${props`uid`}.isAdmin`),
  {
    true: [set(props`isAdmin`, false), set(props`groups`, [])],
    false: [set(props`isAdmin`, true), set(props`groups`, ['Admin'])],
  },
  httpPut(string`${state`admin.users.${props`uid`}.@id`}`, {
    groups: props`groups`,
  }),
  {
    success: [set(state`admin.users.${props`uid`}.isAdmin`, props`isAdmin`)],
    error: showValidationError(
      string`Admin could not be toggled for ${state`admin.users.${props`uid`}.nickname`}`
    ),
  },
  set(state`admin.users.${props`uid`}.toggleAdminIsLoading`, false),
])
