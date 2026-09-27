import axios from 'axios'

// Single Axios instance used across the app. All service modules import
// this instead of calling axios directly, so base URL, auth headers and
// error normalization stay in one place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

const TOKEN_KEY = 'votesphere_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Attach the JWT to every outgoing request when we have one.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalize backend errors into a single shape the UI can rely on:
// { status, message, raw }. The backend's error payloads aren't fully
// predictable, so we defensively check a few common shapes rather than
// assuming one.
function extractMessage(error) {
  const data = error?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return data.message
  if (data?.error) return data.error
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((e) => e.message || e).join(', ')
  }
  return null
}

const FRIENDLY_STATUS_MESSAGES = {
  400: 'That request could not be processed. Please check the details and try again.',
  401: 'Your session has expired. Please log in again.',
  403: "You don't have permission to access this section.",
  404: "We couldn't find what you're looking for.",
  500: 'Something went wrong on the server. Please try again.',
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const backendMessage = extractMessage(error)
    const message =
      backendMessage ||
      FRIENDLY_STATUS_MESSAGES[status] ||
      (error.code === 'ERR_NETWORK'
        ? 'Could not reach the server. Is the backend running?'
        : 'Something unexpected happened. Please try again.')

    if (status === 401) {
      clearToken()
    }

    return Promise.reject({
      status: status ?? null,
      message,
      raw: error,
    })
  }
)

export default api
