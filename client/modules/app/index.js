import base64UrlDecode from 'jwt-decode/lib/base64_url_decode'

import routeTo from './chains/routeTo'

export default ({controller, path}) => {
  let initialFlash = false
  let flash = null
  let flashType = null
  const location = window.location
  const urlParams = new URLSearchParams(location.search)
  let urlParamsChanged = false
  if (urlParams.has('flash')) {
    initialFlash = true
    flash = base64UrlDecode(urlParams.get('flash'))
    urlParams.delete('flash')
    if (urlParams.has('flashtype')) {
      flashType = urlParams.get('flashtype')
      urlParams.delete('flashtype')
    }
    urlParamsChanged = true
  }
  if (urlParamsChanged) {
    window.history.replaceState({}, '', `${location.pathname}?${urlParams}`)
  }

  return {
    state: {
      currentPage: null,
      lastVisited: null,
      flash: flash,
      flashType: flashType,
      initialFlash: initialFlash
    },
    signals: {
      pageRouted: routeTo
    }
  }
}
