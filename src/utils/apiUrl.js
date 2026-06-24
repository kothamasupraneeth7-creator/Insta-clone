const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://apis.ccbp.in'
const IS_DEV = import.meta.env.DEV

export const getApiUrl = (path) => {
  if (typeof path !== 'string') {
    return path
  }
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  if (IS_DEV) {
    return path
  }
  if (path.startsWith('/apis')) {
    return `${API_BASE_URL}${path.substring('/apis'.length)}`
  }
  return `${API_BASE_URL}${path}`
}
