import { useQuery } from "@tanstack/react-query"
import { getDashboardKPIs, getStockAlerts, getNotifications } from "@/lib/services/dashboard"

// Clés de requête
export const dashboardKeys = {
  all: ["dashboard"] as const,
  kpis: () => [...dashboardKeys.all, "kpis"] as const,
  stockAlerts: () => [...dashboardKeys.all, "stock-alerts"] as const,
  notifications: () => [...dashboardKeys.all, "notifications"] as const,
}

// Hook pour les KPIs du dashboard
export function useDashboardKPIs() {
  return useQuery({
    queryKey: dashboardKeys.kpis(),
    queryFn: getDashboardKPIs,
    refetchInterval: 60000, // Refetch toutes les minutes
  })
}

// Hook pour les alertes de stock
export function useStockAlerts() {
  return useQuery({
    queryKey: dashboardKeys.stockAlerts(),
    queryFn: getStockAlerts,
    refetchInterval: 30000, // Refetch toutes les 30 secondes
  })
}

// Hook pour les notifications
export function useNotifications(params?: {
  page?: number
  per_page?: number
  unread_only?: boolean
}) {
  return useQuery({
    queryKey: [...dashboardKeys.notifications(), params],
    queryFn: () => getNotifications(params),
    refetchInterval: 30000,
  })
}
