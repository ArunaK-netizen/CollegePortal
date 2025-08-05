import { apiClient } from './client'

export const userApi = {
  getAll: async () => {
    const response = await apiClient.get('/users')
    return response.data
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put('/users/me', data)
    return response.data
  },

  deleteUser: async (id: number) => {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },
}