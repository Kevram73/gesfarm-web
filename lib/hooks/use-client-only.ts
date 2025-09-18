import { useEffect, useState } from 'react'

/**
 * Hook qui retourne true seulement après l'hydratation côté client
 * Évite les erreurs d'hydratation en s'assurant que le rendu serveur et client sont identiques
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook pour vérifier l'authentification de manière sûre pour l'hydratation
 */
export function useAuthSafe() {
  const isClient = useClientOnly()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("gesfarm_token")
      setIsAuthenticated(!!token)
    }
  }, [isClient])

  return isAuthenticated
}
