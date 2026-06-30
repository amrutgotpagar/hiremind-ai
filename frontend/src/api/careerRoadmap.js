import api from './axios'

export function generateRoadmap(payload) {
  return api.post('/career-roadmap/generate', payload)
}

export function getRoadmap(roadmapId) {
  return api.get(`/career-roadmap/${roadmapId}`)
}

export function getMyRoadmaps() {
  return api.get('/career-roadmap/my')
}