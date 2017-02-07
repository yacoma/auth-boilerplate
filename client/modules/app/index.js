import base64UrlDecode from 'jwt-decode/lib/base64_url_decode'

import routeTo from './chains/routeTo'
import removeFlash from './chains/removeFlash'

export default (module) => {
  let showFlash = false
  let flash = null
  let flashType = null
  const location = window.location
  const urlParams = new URLSearchParams(location.search)
  if (urlParams.has('flash')) {
    showFlash = true
    flash = base64UrlDecode(urlParams.get('flash'))
    urlParams.delete('flash')
    if (urlParams.has('flashtype')) {
      flashType = urlParams.get('flashtype')
      urlParams.delete('flashtype')
    }
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`)
  }

  return {
    state: {
      currentPage: null,
      lastVisited: null,
      flash: flash,
      flashType: flashType,
      showFlash: showFlash
    },
    signals: {
      pageRouted: routeTo,
      flashClosed: removeFlash
    }
  }
}
