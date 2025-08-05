import { apiClient } from './client'

export const courseApi = {
  getAll: async () => {
    const response = await apiClient.get('/courses')
    return response.data
  },

  create: async (data: { name: string; department_id: number; semester: number }) => {
    const response = await apiClient.post('/courses', data)
    return response.data
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/courses/${id}`)
    return response.data
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/courses/${id}`)
    return response.data
  },

  getMyCourses: async () => {
    const response = await apiClient.get('/student-courses/me')
    return response.data
  },

  getFacultyCourses: async () => {
    const response = await apiClient.get('/courses/faculty/me')
    return response.data
  },
}