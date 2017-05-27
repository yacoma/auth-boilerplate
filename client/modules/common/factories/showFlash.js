import { sequence } from 'cerebral'
import { set, debounce } from 'cerebral/operators'
import { state } from 'cerebral/tags'

const showFlashDebounce = debounce.shared()

function showFlash(flash, flashType = null, ms = 7000) {
  return sequence('Show flash', [
    set(state`app.flash`, flash),
    set(state`app.flashType`, flashType),
    showFlashDebounce(ms),
    {
      continue: [set(state`app.flash`, null), set(state`app.flashType`, null)],
      discard: [],
    },
  ])
}

export default showFlash
