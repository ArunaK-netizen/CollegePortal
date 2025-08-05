import { apiClient } from './client'

export const attendanceApi = {
  postAttendance: async (data: { class_id: number; student_id: number; status: string }) => {
    const response = await apiClient.post('/attendance', data)
    return response.data
  },

  getMyAttendance: async () => {
    const response = await apiClient.get('/attendance/me')
    return response.data
  },

  getClassAttendance: async (class_id: number) => {
    const response = await apiClient.get(`/attendance/class/${class_id}`)
    return response.data
  },
}
