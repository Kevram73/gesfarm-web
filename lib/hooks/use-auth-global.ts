import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/services/api'
import { authService } from '@/lib/services/auth'

interface User {
  id: number
  name: string
  email: string
  roles: string[]
  avatar?: string
  last_login?: string
  permissions?: string[]
}

interface AuthData {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isLoading: boolean
  lastChecked: number
}

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: User
  expires_at?: string
}

let globalAuthState: AuthData = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  lastChecked: 0
}

let globalAuthListeners: ((authData: AuthData) => void)[] = []

/**
 * Hook global pour gérer l'état d'authentification de manière sûre pour l'hydratation
 */
export function useAuthGlobal() {
  const [authData, setAuthData] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    lastChecked: 0
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Ajouter ce composant à la liste des listeners
    globalAuthListeners.push(setAuthData)

    // Vérifier l'authentification côté client
    const authStr = localStorage.getItem("gesfarm_auth")
    let authData: AuthData = {
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      lastChecked: Date.now()
    }
    
    if (authStr) {
      try {
        const parsed = JSON.parse(authStr)
        authData = {
          isAuthenticated: parsed.isAuthenticated || false,
          user: parsed.user || null,
          token: parsed.token || null,
          isLoading: false,
          lastChecked: parsed.lastChecked || Date.now()
        }
      } catch (error) {
        console.error("Erreur lors du parsing des données d'authentification:", error)
      }
    }
    
    console.log("useAuthGlobal: Initialisation avec", {
      hasToken: !!authData.token,
      hasUser: !!authData.user,
      isAuthenticated: authData.isAuthenticated
    })
    
    // Mettre à jour l'état global et local
    globalAuthState = authData
    setAuthData(authData)
    
    // Notifier tous les autres listeners
    globalAuthListeners.forEach(listener => {
      if (listener !== setAuthData) {
        listener(authData)
      }
    })

    // Cleanup
    return () => {
      globalAuthListeners = globalAuthListeners.filter(listener => listener !== setAuthData)
    }
  }, [mounted])

  // Pendant l'hydratation, retourner false pour éviter les problèmes
  if (!mounted) {
    return false
  }

  // Ajouter un délai pour stabiliser l'état d'authentification
  return authData.isAuthenticated
}

/**
 * Hook pour obtenir toutes les données d'authentification
 */
export function useAuthData() {
  const [authData, setAuthData] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    lastChecked: 0
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    globalAuthListeners.push(setAuthData)
    
    // Initialiser avec l'état global actuel
    setAuthData(globalAuthState)

    return () => {
      globalAuthListeners = globalAuthListeners.filter(listener => listener !== setAuthData)
    }
  }, [mounted])

  if (!mounted) {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      lastChecked: 0
    }
  }

  return authData
}

/**
 * Fonction pour mettre à jour l'état d'authentification global
 */
export function setAuthData(authData: Partial<AuthData>) {
  const newAuthData: AuthData = {
    ...globalAuthState,
    ...authData,
    lastChecked: Date.now()
  }
  
  globalAuthState = newAuthData
  
  // Mettre à jour le localStorage
  if (newAuthData.isAuthenticated && newAuthData.token && newAuthData.user) {
    localStorage.setItem("gesfarm_auth", JSON.stringify({
      isAuthenticated: newAuthData.isAuthenticated,
      user: newAuthData.user,
      token: newAuthData.token,
      lastChecked: newAuthData.lastChecked
    }))
  } else {
    localStorage.removeItem("gesfarm_auth")
  }
  
  globalAuthListeners.forEach(listener => listener(newAuthData))
}

/**
 * Fonction pour déconnecter l'utilisateur
 */
export function logout() {
  setAuthData({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false
  })
}

/**
 * Hook pour gérer l'authentification avec des fonctions avancées
 */
export function useAuth() {
  const authData = useAuthData()

  const login = useCallback(async (credentials: LoginCredentials): Promise<LoginResponse> => {
    setAuthData({ isLoading: true })
    
    try {
      const response = await api.post<LoginResponse>("/login", credentials)
      const { token, user } = response.data

      setAuthData({
        isAuthenticated: true,
        user: user,
        token: token,
        isLoading: false
      })

      return response.data
    } catch (error) {
      setAuthData({ isLoading: false })
      throw error
    }
  }, [])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!authData.token) return false

    setAuthData({ isLoading: true })
    
    try {
      const response = await api.post("/refresh")
      const { token, user } = response.data

      setAuthData({
        isAuthenticated: true,
        user: user,
        token: token,
        isLoading: false
      })

      return true
    } catch (error) {
      setAuthData({ isLoading: false })
      logout()
      return false
    }
  }, [authData.token])

  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (!authData.token) return false

    // Éviter de vérifier trop souvent (max 1 fois par minute)
    if (Date.now() - authData.lastChecked < 60000) {
      return authData.isAuthenticated
    }

    try {
      // Vérifier la validité du token côté serveur
      const isValid = await authService.checkAuth()
      setAuthData({ lastChecked: Date.now() })
      
      if (!isValid) {
        // Token invalide, déconnecter l'utilisateur
        logout()
        return false
      }
      
      return true
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error)
      // En cas d'erreur, déconnecter l'utilisateur
      logout()
      return false
    }
  }, [authData.token, authData.lastChecked, authData.isAuthenticated])

  const hasPermission = useCallback((permission: string): boolean => {
    if (!authData.user?.permissions) return false
    return authData.user.permissions.includes(permission)
  }, [authData.user?.permissions])

  const hasRole = useCallback((role: string): boolean => {
    if (!authData.user?.roles) return false
    return authData.user.roles.includes(role)
  }, [authData.user?.roles])

  return {
    ...authData,
    login,
    logout,
    refreshToken,
    checkAuth,
    hasPermission,
    hasRole
  }
}
