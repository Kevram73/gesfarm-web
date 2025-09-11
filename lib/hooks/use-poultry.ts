import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  getPoultryFlocks, 
  getPoultryFlock, 
  createPoultryFlock, 
  updatePoultryFlock, 
  deletePoultryFlock,
  getPoultryRecords,
  createPoultryRecord,
  getIncubationRecords,
  createIncubationRecord,
  getPoultryAnalytics,
  type CreatePoultryFlockData,
  type CreatePoultryRecordData,
  type CreateIncubationRecordData
} from "@/lib/services/poultry"

// Clés de requête
export const poultryKeys = {
  all: ["poultry"] as const,
  flocks: () => [...poultryKeys.all, "flocks"] as const,
  flock: (id: number) => [...poultryKeys.flocks(), id] as const,
  records: () => [...poultryKeys.all, "records"] as const,
  incubation: () => [...poultryKeys.all, "incubation"] as const,
  analytics: () => [...poultryKeys.all, "analytics"] as const,
}

// Hook pour récupérer les lots de volailles
export function usePoultryFlocks(params?: {
  page?: number
  per_page?: number
  type?: string
  search?: string
}) {
  return useQuery({
    queryKey: [...poultryKeys.flocks(), params],
    queryFn: () => getPoultryFlocks(params),
  })
}

// Hook pour récupérer un lot spécifique
export function usePoultryFlock(id: number) {
  return useQuery({
    queryKey: poultryKeys.flock(id),
    queryFn: () => getPoultryFlock(id),
    enabled: !!id,
  })
}

// Hook pour créer un lot
export function useCreatePoultryFlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPoultryFlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poultryKeys.flocks() })
    },
  })
}

// Hook pour mettre à jour un lot
export function useUpdatePoultryFlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePoultryFlockData> }) =>
      updatePoultryFlock(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(poultryKeys.flock(data.id), data)
      queryClient.invalidateQueries({ queryKey: poultryKeys.flocks() })
    },
  })
}

// Hook pour supprimer un lot
export function useDeletePoultryFlock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePoultryFlock,
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: poultryKeys.flock(id) })
      queryClient.invalidateQueries({ queryKey: poultryKeys.flocks() })
    },
  })
}

// Hook pour les enregistrements avicoles
export function usePoultryRecords(params?: {
  page?: number
  per_page?: number
  flock_id?: number
  start_date?: string
  end_date?: string
}) {
  return useQuery({
    queryKey: [...poultryKeys.records(), params],
    queryFn: () => getPoultryRecords(params),
  })
}

// Hook pour créer un enregistrement
export function useCreatePoultryRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPoultryRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poultryKeys.records() })
      queryClient.invalidateQueries({ queryKey: poultryKeys.flocks() })
    },
  })
}

// Hook pour les enregistrements d'incubation
export function useIncubationRecords(params?: {
  page?: number
  per_page?: number
  egg_type?: string
}) {
  return useQuery({
    queryKey: [...poultryKeys.incubation(), params],
    queryFn: () => getIncubationRecords(params),
  })
}

// Hook pour créer un enregistrement d'incubation
export function useCreateIncubationRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIncubationRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: poultryKeys.incubation() })
    },
  })
}

// Hook pour les analytics avicoles
export function usePoultryAnalytics(params?: {
  start_date?: string
  end_date?: string
  flock_id?: number
}) {
  return useQuery({
    queryKey: [...poultryKeys.analytics(), params],
    queryFn: () => getPoultryAnalytics(params),
  })
}
