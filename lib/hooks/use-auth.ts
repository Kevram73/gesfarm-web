import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { login, logout, getProfile, type LoginCredentials, type User } from "@/lib/services/auth"

// Clés de requête
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
}

// Hook pour obtenir le profil utilisateur
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: getProfile,
    enabled: !!localStorage.getItem("gesfarm_token"),
  })
}

// Hook pour la connexion
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Stocker le token et les données utilisateur
      localStorage.setItem("gesfarm_token", data.data.token)
      localStorage.setItem("gesfarm_user", JSON.stringify(data.data.user))
      
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
      // Nettoyer le cache
      queryClient.clear()
    },
  })
}
