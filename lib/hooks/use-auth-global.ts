import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  role?: string
}

interface AuthData {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

let globalAuthState: AuthData = {
  isAuthenticated: false,
  user: null,
  token: null
}

let globalAuthListeners: ((authData: AuthData) => void)[] = []

/**
 * Hook global pour gérer l'état d'authentification de manière sûre pour l'hydratation
 */
export function useAuthGlobal() {
  const [authData, setAuthData] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
    token: null
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
    const token = localStorage.getItem("gesfarm_token")
    const userStr = localStorage.getItem("gesfarm_user")
    const user = userStr ? JSON.parse(userStr) : null
    
    const newAuthData: AuthData = {
      isAuthenticated: !!token,
      user: user,
      token: token
    }
    
    // Mettre à jour l'état global et local
    globalAuthState = newAuthData
    setAuthData(newAuthData)
    
    // Notifier tous les autres listeners
    globalAuthListeners.forEach(listener => {
      if (listener !== setAuthData) {
        listener(newAuthData)
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

  return authData.isAuthenticated
}

/**
 * Hook pour obtenir toutes les données d'authentification
 */
export function useAuthData() {
  const [authData, setAuthData] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
    token: null
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
      token: null
    }
  }

  return authData
}

/**
 * Fonction pour mettre à jour l'état d'authentification global
 */
export function setAuthData(authData: AuthData) {
  globalAuthState = authData
  
  // Mettre à jour le localStorage
  if (authData.isAuthenticated && authData.token && authData.user) {
    localStorage.setItem("gesfarm_token", authData.token)
    localStorage.setItem("gesfarm_user", JSON.stringify(authData.user))
  } else {
    localStorage.removeItem("gesfarm_token")
    localStorage.removeItem("gesfarm_user")
  }
  
  globalAuthListeners.forEach(listener => listener(authData))
}

/**
 * Fonction pour déconnecter l'utilisateur
 */
export function logout() {
  setAuthData({
    isAuthenticated: false,
    user: null,
    token: null
  })
}
