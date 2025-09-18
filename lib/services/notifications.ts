import api from "./api"

export interface Notification {
  id: number
  type: "stock_alert" | "health_alert" | "task_reminder" | "system" | "custom"
  title: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  is_read: boolean
  related_entity_type?: "StockItem" | "Cattle" | "Poultry" | "Crop" | "Task" | "Zone"
  related_entity_id?: number
  created_at: string
  updated_at: string
}

export interface CreateNotificationData {
  type: "stock_alert" | "health_alert" | "task_reminder" | "system" | "custom"
  title: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  related_entity_type?: "StockItem" | "Cattle" | "Poultry" | "Crop" | "Task" | "Zone"
  related_entity_id?: number
}

export interface NotificationStats {
  total_notifications: number
  unread_count: number
  by_type: {
    stock_alert: number
    health_alert: number
    task_reminder: number
    system: number
    custom: number
  }
  by_priority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
}

// Notifications
export const getNotifications = async (params?: {
  page?: number
  per_page?: number
  type?: string
  priority?: string
  unread_only?: boolean
  search?: string
}): Promise<{ items: Notification[]; pagination: any }> => {
  const response = await api.get("/notifications", { params })
  return response.data.data
}

export const getUnreadNotifications = async (params?: {
  page?: number
  per_page?: number
}): Promise<{ items: Notification[]; pagination: any }> => {
  const response = await api.get("/notifications/unread", { params })
  return response.data.data
}

export const createNotification = async (data: CreateNotificationData): Promise<Notification> => {
  const response = await api.post("/notifications", data)
  return response.data.data
}

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await api.put(`/notifications/${id}/read`)
}

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.put("/notifications/mark-all-read")
}

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/notifications/${id}`)
}

// Statistiques des notifications
export const getNotificationStats = async (): Promise<NotificationStats> => {
  const response = await api.get("/notifications/stats")
  return response.data.data
}
