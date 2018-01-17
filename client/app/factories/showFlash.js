import { sequence } from 'cerebral'
import { set, debounce } from 'cerebral/operators'
import { state } from 'cerebral/tags'

const showFlashDebounce = debounce.shared()

function showFlash(flash, flashType = null, ms = 7000) {
  return sequence('Show flash', [
    set(state`flash`, flash),
    set(state`flashType`, flashType),
    showFlashDebounce(ms),
    {
      continue: [set(state`flash`, null), set(state`flashType`, null)],
      discard: [],
    },
  ])
}

export default showFlash
