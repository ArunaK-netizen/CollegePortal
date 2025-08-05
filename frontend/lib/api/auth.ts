import { apiClient } from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: 'student' | 'faculty'
  roll_number?: string
  department_id?: number
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  register: async (data: RegisterRequest): Promise<any> => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh')
    return response.data
  },
}