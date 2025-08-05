import { apiClient } from './client'

export const departmentApi = {
  getAll: async () => {
    const response = await apiClient.get('/departments')
    return response.data
  },

  create: async (data: { name: string }) => {
    const response = await apiClient.post('/departments', data)
    return response.data
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/departments/${id}`)
    return response.data
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/departments/${id}`)
    return response.data
  },
}