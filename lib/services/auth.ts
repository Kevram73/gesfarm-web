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
  created_at?: string
  updated_at?: string
}

export interface LoginResponse {
  status: string
  message: string
  data: {
    user: User
    token: string
  }
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role?: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  email: string
  token: string
  password: string
  password_confirmation: string
}

// Fonction pour obtenir l'API appropriée
function getApi() {
  // Utiliser le proxy par défaut pour éviter les problèmes CORS
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem('gesfarm_api_mode')
    
    // Si l'utilisateur a explicitement choisi l'API directe, l'utiliser
    if (savedMode === 'direct') {
      return api
    }
    
    // Sinon, utiliser le proxy par défaut
    return api
  }
  return api
}

// Service d'authentification
export const authService = {
  // Connexion
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const apiClient = getApi()
      const response = await apiClient.post("/login", credentials)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur de connexion")
    }
  },

  // Inscription
  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const apiClient = getApi()
      const response = await apiClient.post("/auth/register", data)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur d'inscription")
    }
  },

  // Déconnexion
  async logout(): Promise<void> {
    try {
      const apiClient = getApi()
      await apiClient.post("/auth/logout")
    } catch (error: any) {
      // Même en cas d'erreur, on considère que l'utilisateur est déconnecté
      console.warn("Erreur lors de la déconnexion:", error)
    }
  },

  // Récupérer le profil utilisateur
  async getProfile(): Promise<User> {
    try {
      const apiClient = getApi()
      const response = await apiClient.get("/auth/profile")
      return response.data.data || response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur lors de la récupération du profil")
    }
  },

  // Rafraîchir le token
  async refreshToken(): Promise<LoginResponse> {
    try {
      const apiClient = getApi()
      const response = await apiClient.post("/auth/refresh")
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur lors du rafraîchissement du token")
    }
  },

  // Mot de passe oublié
  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    try {
      const apiClient = getApi()
      await apiClient.post("/auth/forgot-password", data)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur lors de l'envoi de l'email")
    }
  },

  // Réinitialiser le mot de passe
  async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      const apiClient = getApi()
      await apiClient.post("/auth/reset-password", data)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe")
    }
  },

  // Vérifier si l'utilisateur est authentifié
  async checkAuth(): Promise<boolean> {
    try {
      const apiClient = getApi()
      const response = await apiClient.get("/auth/me")
      return response.status === 200
    } catch (error: any) {
      return false
    }
  }
}