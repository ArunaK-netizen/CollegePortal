import { apiClient } from './client'

export const departmentApi = {
  getAll: async () => {
    const response = await apiClient.get('/departments')
    return response.data
  },
}