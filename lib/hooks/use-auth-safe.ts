import { useHydration } from './use-hydration'

/**
 * Hook pour vérifier l'authentification de manière sûre pour l'hydratation
 * Évite les erreurs d'hydratation en retournant false côté serveur
 */
export function useIsAuthenticated() {
  const isHydrated = useHydration()
  
  if (!isHydrated) {
    return false
  }
  
  return typeof window !== 'undefined' && !!localStorage.getItem("gesfarm_token")
}

/**
 * Hook pour obtenir le token de manière sûre pour l'hydratation
 */
export function useAuthToken() {
  const isHydrated = useHydration()
  
  if (!isHydrated) {
    return null
  }
  
  return typeof window !== 'undefined' ? localStorage.getItem("gesfarm_token") : null
}

/**
 * Hook pour obtenir l'utilisateur de manière sûre pour l'hydratation
 */
export function useAuthUser() {
  const isHydrated = useHydration()
  
  if (!isHydrated) {
    return null
  }
  
  if (typeof window === 'undefined') {
    return null
  }
  
  const userStr = localStorage.getItem("gesfarm_user")
  return userStr ? JSON.parse(userStr) : null
}
