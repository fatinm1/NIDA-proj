export interface User {
  id: number
  email: string
  role: 'ADMIN' | 'USER'
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  user: User
  message: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  firmName: string
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001');
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Login failed')
  }

  return response.json()
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001');
  const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Registration failed')
  }

  return response.json()
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001');
    const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
      credentials: 'include',
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.user
    }
    
    return null
  } catch (error) {
    return null
  }
}

export async function logout(): Promise<void> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001');
    await fetch(`${API_BASE_URL}/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch (error) {
    // Ignore logout errors
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  // For now, check if we have a user in localStorage
  // In a real app, this would check JWT tokens or session cookies
  return typeof window !== 'undefined' && localStorage.getItem('user') !== null
}

// Get user from localStorage
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

// Store user in localStorage
export function storeUser(user: User): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('user', JSON.stringify(user))
}

// Remove user from localStorage
export function removeStoredUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('user')
}
