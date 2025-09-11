import api from "./api"

export interface DashboardKPIs {
  total_poultry: number
  total_cattle: number
  total_crops: number
  total_zones: number
  stock_alerts_count: number
  low_stock_items: number
  recent_activities: Array<{
    id: number
    type: string
    description: string
    created_at: string
  }>
  production_summary: {
    eggs_today: number
    milk_today: number
    mortality_rate: number
    feed_consumption: number
  }
  financial_summary: {
    monthly_revenue: number
    monthly_expenses: number
    profit_margin: number
  }
}

export interface StockAlert {
  id: number
  stock_item_id: number
  stock_item: {
    id: number
    name: string
    current_quantity: number
    minimum_quantity: number
    unit: string
  }
  alert_type: "low_stock" | "expired" | "expiring_soon"
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  created_at: string
}

export interface Notification {
  id: number
  type: string
  title: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  is_read: boolean
  related_entity_type?: string
  related_entity_id?: number
  created_at: string
}

// Dashboard principal
export const getDashboardKPIs = async (): Promise<DashboardKPIs> => {
  const response = await api.get("/dashboard")
  return response.data.data
}

// Alertes de stock
export const getStockAlerts = async (): Promise<StockAlert[]> => {
  const response = await api.get("/dashboard/stock-alerts")
  return response.data.data
}

// Notifications
export const getNotifications = async (params?: {
  page?: number
  per_page?: number
  unread_only?: boolean
}): Promise<{ items: Notification[]; pagination: any }> => {
  const response = await api.get("/notifications", { params })
  return response.data.data
}

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await api.put(`/notifications/${id}/read`)
}

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.put("/notifications/mark-all-read")
}

// Analytics globaux
export const getFarmOverview = async (params?: {
  start_date?: string
  end_date?: string
}): Promise<any> => {
  const response = await api.get("/analytics/farm-overview", { params })
  return response.data.data
}
