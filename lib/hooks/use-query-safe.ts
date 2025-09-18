import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { useIsAuthenticated } from "./use-auth-safe"

/**
 * Hook wrapper pour useQuery qui gère l'authentification de manière sûre pour l'hydratation
 */
export function useQuerySafe<TData = unknown, TError = unknown>(
  options: Omit<UseQueryOptions<TData, TError>, 'enabled'> & {
    requireAuth?: boolean
  }
) {
  const isAuthenticated = useIsAuthenticated()
  
  return useQuery({
    ...options,
    enabled: options.requireAuth ? isAuthenticated : true,
  })
}
