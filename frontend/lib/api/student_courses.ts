import { apiClient } from './client'

export const studentCourseApi = {
  register: async (data: { course_id: number; faculty_id: number }) => {
    const response = await apiClient.post('/student-courses', data)
    return response.data
  },

  getMyCourses: async () => {
    const response = await apiClient.get('/student-courses/me')
    return response.data
  },

  getRegisteredStudents: async (faculty_id: number) => {
    const response = await apiClient.get(`/student-courses/faculty/${faculty_id}`)
    return response.data
  },

  getRegistrationStatus: async () => {
    const response = await apiClient.get('/student-courses/registration-status')
    return response.data
  },

  getAvailableCourses: async () => {
    const response = await apiClient.get('/student-courses/available')
    return response.data
  },
}
