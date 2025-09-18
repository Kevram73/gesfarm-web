import { useEffect, useState } from 'react'

/**
 * Hook pour gérer l'hydratation côté client
 * Évite les erreurs d'hydratation en s'assurant que le composant
 * est rendu de la même manière côté serveur et client
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Hook pour vérifier si on est côté client après hydratation
 */
export function useIsClient() {
  const isHydrated = useHydration()
  return isHydrated && typeof window !== 'undefined'
}
