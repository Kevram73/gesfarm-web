import api from "./api"

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  permissions?: string[]
}

export interface AuthResponse {
  status: string
  message: string
  data: {
    user: User
    token: string
  }
}

// Connexion
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post("/login", credentials)
  return response.data
}

// Déconnexion
export const logout = async (): Promise<void> => {
  try {
    await api.post("/logout")
  } catch (error) {
    console.error("Erreur lors de la déconnexion API:", error)
    // Continuer même si l'API échoue
  }
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem("gesfarm_token")
    localStorage.removeItem("gesfarm_user")
  }
}

// Obtenir le profil utilisateur
export const getProfile = async (): Promise<User> => {
  const response = await api.get("/profile")
  return response.data.data
}

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem("gesfarm_token")
}

// Obtenir l'utilisateur depuis le localStorage
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem("gesfarm_user")
  return userStr ? JSON.parse(userStr) : null
}
