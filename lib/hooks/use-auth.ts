import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { login, logout, getProfile, type LoginCredentials, type User } from "@/lib/services/auth"
import { useAuthGlobal, setAuthGlobal } from "./use-auth-global"

// Clés de requête
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
}

// Hook pour obtenir le profil utilisateur
export function useProfile() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: getProfile,
    enabled: isAuthenticated,
  })
}

// Hook pour la connexion
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Stocker le token et les données utilisateur
      if (typeof window !== 'undefined') {
        localStorage.setItem("gesfarm_token", data.data.token)
        localStorage.setItem("gesfarm_user", JSON.stringify(data.data.user))
        setAuthGlobal(true)
      }
      
      // Invalider et refetch le profil
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
  })
}

// Hook pour la déconnexion
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Mettre à jour l'état global
      setAuthGlobal(false)
      // Nettoyer le cache
      queryClient.clear()
      // Rediriger vers la page de connexion
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    },
    onError: (error) => {
      console.error("Erreur lors de la déconnexion:", error)
      // Même en cas d'erreur, nettoyer le localStorage et rediriger
      if (typeof window !== 'undefined') {
        localStorage.removeItem("gesfarm_token")
        localStorage.removeItem("gesfarm_user")
        setAuthGlobal(false)
        queryClient.clear()
        window.location.href = '/login'
      }
    },
  })
}
