import api from './api'

/**
 * All /candidate calls are isolated here on purpose.
 *
 * KNOWN-STABLE ROUTES (per backend spec):
 *   GET    /candidate/                -> list all candidates
 *   POST   /candidate/                -> add candidate (admin)
 *   POST   /candidate/vote/:id        -> cast a vote
 *   GET    /candidate/vote/count      -> party-wise vote tallies
 *
 * ROUTES FLAGGED AS UNCERTAIN in the spec:
 *   Update candidate: described only as "around /candidate/profile/:candidateID"
 *   Delete candidate: described only as "implemented in the candidate router"
 *
 * Because the exact verb/path pairing for update & delete was not confirmed,
 * both are implemented as a single attempt against the most likely route
 * (PUT /candidate/profile/:id for update, DELETE /candidate/profile/:id for
 * delete) with the HTTP method and path kept in the two constants below.
 * If the real backend route differs, change ONLY these two functions —
 * nothing else in the app needs to know the actual path.
 */

export async function getAllCandidates() {
  const { data } = await api.get('/candidate/')
  return data
}

export async function addCandidate(payload) {
  const { data } = await api.post('/candidate/', payload)
  return data
}

export async function voteForCandidate(candidateId) {
  const { data } = await api.post(`/candidate/vote/${candidateId}`)
  return data
}

export async function getVoteCount() {
  const { data } = await api.get('/candidate/vote/count')
  return data
}

// --- Uncertain routes: isolated so they're a one-line fix later ---

export async function updateCandidate(candidateId, payload) {
  const { data } = await api.put(`/candidate/profile/${candidateId}`, payload)
  return data
}

export async function deleteCandidate(candidateId) {
  const { data } = await api.delete(`/candidate/profile/${candidateId}`)
  return data
}

// Normalizes the various shapes /candidate/ or /candidate/vote/count might
// respond with (a bare array vs. { candidates: [...] } / { data: [...] }).
export function extractList(responseData) {
  if (Array.isArray(responseData)) return responseData
  if (Array.isArray(responseData?.candidates)) return responseData.candidates
  if (Array.isArray(responseData?.data)) return responseData.data
  return []
}
