import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getStockItems, 
  getStockItem, 
  createStockItem, 
  updateStockItem, 
  deleteStockItem,
  getStockMovements,
  createStockMovement,
  getStockAlerts,
  type StockItem,
  type CreateStockItemData,
  type CreateStockMovementData
} from "@/lib/services/stock"

// Clés de requête
export const stockKeys = {
  all: ["stock"] as const,
  items: () => [...stockKeys.all, "items"] as const,
  item: (id: number) => [...stockKeys.items(), id] as const,
  movements: () => [...stockKeys.all, "movements"] as const,
  alerts: () => [...stockKeys.all, "alerts"] as const,
}

// Hook pour récupérer les articles de stock
export function useStockItems(params?: {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
}) {
  return useQuery({
    queryKey: [...stockKeys.items(), params],
    queryFn: () => getStockItems(params),
  })
}

// Hook pour récupérer un article spécifique
export function useStockItem(id: number) {
  return useQuery({
    queryKey: stockKeys.item(id),
    queryFn: () => getStockItem(id),
    enabled: !!id,
  })
}

// Hook pour créer un article
export function useCreateStockItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStockItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.items() })
    },
  })
}

// Hook pour mettre à jour un article
export function useUpdateStockItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateStockItemData> }) =>
      updateStockItem(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(stockKeys.item(data.id), data)
      queryClient.invalidateQueries({ queryKey: stockKeys.items() })
    },
  })
}

// Hook pour supprimer un article
export function useDeleteStockItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStockItem,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: stockKeys.item(id) })
      queryClient.invalidateQueries({ queryKey: stockKeys.items() })
    },
  })
}

// Hook pour les mouvements de stock
export function useStockMovements(params?: {
  page?: number
  per_page?: number
  stock_item_id?: number
  type?: "in" | "out"
}) {
  return useQuery({
    queryKey: [...stockKeys.movements(), params],
    queryFn: () => getStockMovements(params),
  })
}

// Hook pour créer un mouvement
export function useCreateStockMovement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStockMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.movements() })
      queryClient.invalidateQueries({ queryKey: stockKeys.items() })
    },
  })
}

// Hook pour les alertes de stock
export function useStockAlerts() {
  return useQuery({
    queryKey: stockKeys.alerts(),
    queryFn: getStockAlerts,
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  })
}
