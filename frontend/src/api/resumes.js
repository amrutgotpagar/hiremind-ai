import api from './axios'

export function uploadResume(file) {
  const formData = new FormData()
  formData.append('resume', file)
  return api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function getMyResumes() {
  return api.get('/resumes/my')
}

export function generateQuestions(resumeId) {
  return api.post(`/resumes/${resumeId}/generate-questions`)
}