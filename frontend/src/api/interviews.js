import api from './axios'

export function startInterview(resumeId) {
  return api.post('/interviews/start', { resumeId })
}

export function submitAnswers(interviewId, answers) {
  return api.put(`/interviews/${interviewId}/submit-answers`, { answers })
}

export function evaluateInterview(interviewId) {
  return api.post(`/interviews/${interviewId}/evaluate`)
}

export function getInterview(interviewId) {
  return api.get(`/interviews/${interviewId}`)
}

export function getMyInterviews() {
  return api.get('/interviews/my')
}