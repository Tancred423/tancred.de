import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const username = ref<string | null>(localStorage.getItem('username'))

  const isAuthenticated = () => !!token.value

  const login = async (user: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: user,
        password,
      })

      token.value = response.data.token
      username.value = response.data.username

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', response.data.username)

      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    token.value = null
    username.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  const getAuthHeader = () => {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  return {
    token,
    username,
    isAuthenticated,
    login,
    logout,
    getAuthHeader,
  }
})
