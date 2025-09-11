import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUsers, getUser, createUser, updateUser, deleteUser, type User, type CreateUserData, type UpdateUserData } from "@/lib/services/users"

// Clés de requête
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

// Hook pour récupérer tous les utilisateurs
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: getUsers,
  })
}

// Hook pour récupérer un utilisateur spécifique
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id,
  })
}

// Hook pour créer un utilisateur
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalider et refetch la liste des utilisateurs
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Hook pour mettre à jour un utilisateur
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      // Mettre à jour le cache pour cet utilisateur spécifique
      queryClient.setQueryData(userKeys.detail(data.id), data)
      // Invalider la liste des utilisateurs
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

// Hook pour supprimer un utilisateur
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      // Supprimer l'utilisateur du cache
      queryClient.removeQueries({ queryKey: userKeys.detail(id) })
      // Invalider la liste des utilisateurs
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
