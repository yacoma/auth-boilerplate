import { Compute } from 'cerebral'
import { state } from 'cerebral/tags'

export default Compute(state`admin.users`, (users) => {
  return Object.keys(users).sort(
    (uidA, uidB) => users[uidA].orderKey - users[uidB].orderKey
  )
})
