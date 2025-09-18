import { useEffect, useState } from 'react'

let globalAuthState = false
let globalAuthListeners: ((isAuth: boolean) => void)[] = []

/**
 * Hook global pour gérer l'état d'authentification de manière sûre pour l'hydratation
 */
export function useAuthGlobal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Ajouter ce composant à la liste des listeners
    globalAuthListeners.push(setIsAuthenticated)

    // Vérifier l'authentification côté client
    const token = localStorage.getItem("gesfarm_token")
    const authState = !!token
    
    // Mettre à jour l'état global et local
    globalAuthState = authState
    setIsAuthenticated(authState)
    
    // Notifier tous les autres listeners
    globalAuthListeners.forEach(listener => {
      if (listener !== setIsAuthenticated) {
        listener(authState)
      }
    })

    // Cleanup
    return () => {
      globalAuthListeners = globalAuthListeners.filter(listener => listener !== setIsAuthenticated)
    }
  }, [mounted])

  // Pendant l'hydratation, retourner false pour éviter les problèmes
  if (!mounted) {
    return false
  }

  return isAuthenticated
}

/**
 * Fonction pour mettre à jour l'état d'authentification global
 */
export function setAuthGlobal(isAuth: boolean) {
  globalAuthState = isAuth
  globalAuthListeners.forEach(listener => listener(isAuth))
}
