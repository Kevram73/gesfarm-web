"use client"

import { useQuery } from "@tanstack/react-query"
import { 
  fakeDashboardKPIs, 
  fakeStockItems, 
  fakePoultryFlocks, 
  fakeCattle, 
  fakeCrops, 
  fakeStockAlerts,
  fakeNotifications 
} from "@/lib/data/fake-data"

// Simuler un délai de chargement
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Hook pour les KPIs du dashboard
export function useDashboardKPIs() {
  return useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: async () => {
      await delay(800) // Simuler le chargement
      return fakeDashboardKPIs
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook pour les alertes de stock
export function useStockAlerts() {
  return useQuery({
    queryKey: ["dashboard", "stock-alerts"],
    queryFn: async () => {
      await delay(500)
      return fakeStockAlerts
    },
    refetchInterval: 30 * 1000, // 30 secondes
  })
}

// Hook pour les articles de stock
export function useStockItems(params?: {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
}) {
  return useQuery({
    queryKey: ["stock", "items", params],
    queryFn: async () => {
      await delay(600)
      let items = [...fakeStockItems]
      
      // Filtrage par recherche
      if (params?.search) {
        items = items.filter(item => 
          item.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          item.sku.toLowerCase().includes(params.search!.toLowerCase())
        )
      }
      
      // Filtrage par catégorie
      if (params?.category_id) {
        items = items.filter(item => item.category_id === params.category_id)
      }
      
      // Pagination simulée
      const page = params?.page || 1
      const perPage = params?.per_page || 20
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      
      return {
        items: items.slice(startIndex, endIndex),
        pagination: {
          current_page: page,
          last_page: Math.ceil(items.length / perPage),
          per_page: perPage,
          total: items.length
        }
      }
    },
  })
}

// Hook pour les lots de volailles
export function usePoultryFlocks(params?: {
  page?: number
  per_page?: number
  type?: string
  search?: string
}) {
  return useQuery({
    queryKey: ["poultry", "flocks", params],
    queryFn: async () => {
      await delay(700)
      let flocks = [...fakePoultryFlocks]
      
      // Filtrage par type
      if (params?.type) {
        flocks = flocks.filter(flock => flock.type === params.type)
      }
      
      // Filtrage par recherche
      if (params?.search) {
        flocks = flocks.filter(flock => 
          flock.flock_number.toLowerCase().includes(params.search!.toLowerCase()) ||
          flock.breed.toLowerCase().includes(params.search!.toLowerCase())
        )
      }
      
      // Pagination simulée
      const page = params?.page || 1
      const perPage = params?.per_page || 20
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      
      return {
        items: flocks.slice(startIndex, endIndex),
        pagination: {
          current_page: page,
          last_page: Math.ceil(flocks.length / perPage),
          per_page: perPage,
          total: flocks.length
        }
      }
    },
  })
}

// Hook pour les bovins
export function useCattle(params?: {
  page?: number
  per_page?: number
  gender?: string
  breed?: string
  search?: string
}) {
  return useQuery({
    queryKey: ["cattle", params],
    queryFn: async () => {
      await delay(600)
      let cattle = [...fakeCattle]
      
      // Filtrage par genre
      if (params?.gender) {
        cattle = cattle.filter(animal => animal.gender === params.gender)
      }
      
      // Filtrage par race
      if (params?.breed) {
        cattle = cattle.filter(animal => animal.breed === params.breed)
      }
      
      // Filtrage par recherche
      if (params?.search) {
        cattle = cattle.filter(animal => 
          animal.tag_number.toLowerCase().includes(params.search!.toLowerCase()) ||
          (animal.name && animal.name.toLowerCase().includes(params.search!.toLowerCase())) ||
          animal.breed.toLowerCase().includes(params.search!.toLowerCase())
        )
      }
      
      // Pagination simulée
      const page = params?.page || 1
      const perPage = params?.per_page || 20
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      
      return {
        items: cattle.slice(startIndex, endIndex),
        pagination: {
          current_page: page,
          last_page: Math.ceil(cattle.length / perPage),
          per_page: perPage,
          total: cattle.length
        }
      }
    },
  })
}

// Hook pour les cultures
export function useCrops(params?: {
  page?: number
  per_page?: number
  status?: string
  zone_id?: number
  search?: string
}) {
  return useQuery({
    queryKey: ["crops", params],
    queryFn: async () => {
      await delay(600)
      let crops = [...fakeCrops]
      
      // Filtrage par statut
      if (params?.status) {
        crops = crops.filter(crop => crop.status === params.status)
      }
      
      // Filtrage par zone
      if (params?.zone_id) {
        crops = crops.filter(crop => crop.zone_id === params.zone_id)
      }
      
      // Filtrage par recherche
      if (params?.search) {
        crops = crops.filter(crop => 
          crop.name.toLowerCase().includes(params.search!.toLowerCase()) ||
          crop.variety.toLowerCase().includes(params.search!.toLowerCase())
        )
      }
      
      // Pagination simulée
      const page = params?.page || 1
      const perPage = params?.per_page || 20
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      
      return {
        items: crops.slice(startIndex, endIndex),
        pagination: {
          current_page: page,
          last_page: Math.ceil(crops.length / perPage),
          per_page: perPage,
          total: crops.length
        }
      }
    },
  })
}

// Hook pour les notifications
export function useNotifications(params?: {
  page?: number
  per_page?: number
  unread_only?: boolean
}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: async () => {
      await delay(400)
      let notifications = [...fakeNotifications]
      
      // Filtrage par statut de lecture
      if (params?.unread_only) {
        notifications = notifications.filter(notif => !notif.is_read)
      }
      
      // Pagination simulée
      const page = params?.page || 1
      const perPage = params?.per_page || 20
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      
      return {
        items: notifications.slice(startIndex, endIndex),
        pagination: {
          current_page: page,
          last_page: Math.ceil(notifications.length / perPage),
          per_page: perPage,
          total: notifications.length
        }
      }
    },
    refetchInterval: 30 * 1000, // 30 secondes
  })
}
