import api from './axios'

export function getCandidates() {
  return api.get('/hr/candidates')
}

export function getCandidateDetail(candidateId) {
  return api.get(`/hr/candidates/${candidateId}`)
}

export function getRankings() {
  return api.get('/hr/rankings')
}