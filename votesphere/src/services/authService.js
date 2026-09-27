import api from './api'

// All calls to the /user routes live here in isolation, so if the backend's
// exact response shape shifts (e.g. token key name), only this file changes.

export async function signup(payload) {
  const { data } = await api.post('/user/signup', payload)
  return data
}

export async function login(payload) {
  const { data } = await api.post('/user/login', payload)
  return data
}

export async function getProfile() {
  const { data } = await api.get('/user/profile')
  return data
}

export async function changePassword(payload) {
  const { data } = await api.put('/user/profile/password', payload)
  return data
}

// The backend has been observed to return the JWT under different possible
// keys depending on the route. This helper checks the likely candidates so
// the rest of the app doesn't need to guess.
export function extractToken(responseData) {
  if (!responseData) return null
  if (typeof responseData === 'string') return responseData
  return (
    responseData.token ||
    responseData.jwtToken ||
    responseData.accessToken ||
    responseData.data?.token ||
    null
  )
}

// Similarly, the user object may be nested or top-level.
export function extractUser(responseData) {
  if (!responseData) return null
  return responseData.user || responseData.data?.user || responseData.data || null
}
