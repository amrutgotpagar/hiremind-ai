import api from './axios'

export function analyzeResume(resumeId, jobDescription) {
  return api.post('/ats/analyze', { resumeId, jobDescription })
}

export function getAtsReport(reportId) {
  return api.get(`/ats/${reportId}`)
}

export function getMyAtsReports() {
  return api.get('/ats/my')
}