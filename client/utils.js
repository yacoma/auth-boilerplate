/**
 * Extract URL search params from query string and remove
 * extracted parameters from URL in current page
 * @param {string[]} keys - Array of query keys to extract
 * @returns {Object} - Object with keys and extracted values.
 *  If the key was not found the value is set to null.
 */
export function extractUrlParams(keys) {
  const urlParams = new URLSearchParams(location.search)
  let urlParamsChanged = false
  const params = keys.reduce((params, key) => {
    if (urlParams.has(key)) {
      params[key] = urlParams.get(key)
      urlParams.delete(key)
      urlParamsChanged = true
    } else {
      params[key] = null
    }
    return params
  }, {})
  if (urlParamsChanged) {
    history.replaceState({}, '', `${location.pathname}?${urlParams}`)
  }
  return params
}
