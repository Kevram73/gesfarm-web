/**
 * Utilitaires pour gérer les problèmes CORS
 */

export interface CorsError extends Error {
  code?: string
  response?: {
    status: number
    data?: any
  }
}

/**
 * Vérifie si une erreur est liée à CORS
 */
export function isCorsError(error: any): boolean {
  return (
    error?.code === 'ERR_NETWORK' ||
    error?.message?.includes('CORS') ||
    error?.message?.includes('cross-origin') ||
    error?.message?.includes('Access-Control-Allow-Origin') ||
    error?.response?.status === 0 ||
    !error?.response
  )
}

/**
 * Gère les erreurs CORS de manière appropriée
 */
export function handleCorsError(error: any): string {
  if (isCorsError(error)) {
    return 'Erreur de connexion: Problème de configuration CORS. Veuillez vérifier que le serveur API autorise les requêtes depuis ce domaine.'
  }
  
  return error?.response?.data?.message || error?.message || 'Une erreur inattendue s\'est produite'
}

/**
 * Configuration CORS pour les requêtes fetch
 */
export const corsConfig = {
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
}

/**
 * Retry une requête en cas d'erreur CORS
 */
export async function retryWithCors<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      
      if (isCorsError(error) && i < maxRetries - 1) {
        // Attendre un peu avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        continue
      }
      
      throw error
    }
  }
  
  throw lastError
}
