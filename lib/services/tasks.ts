import api from "./api"

export interface Task {
  id: number
  title: string
  description?: string
  type: "daily" | "weekly" | "monthly" | "seasonal" | "urgent"
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "completed" | "cancelled"
  assigned_to?: number
  assigned_user?: {
    id: number
    name: string
    email: string
  }
  due_date?: string
  completed_at?: string
  related_entity_type?: "crop" | "cattle" | "poultry" | "stock" | "zone"
  related_entity_id?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateTaskData {
  title: string
  description?: string
  type: "daily" | "weekly" | "monthly" | "seasonal" | "urgent"
  priority: "low" | "medium" | "high" | "urgent"
  assigned_to?: number
  due_date?: string
  related_entity_type?: "crop" | "cattle" | "poultry" | "stock" | "zone"
  related_entity_id?: number
  notes?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  type?: "daily" | "weekly" | "monthly" | "seasonal" | "urgent"
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "pending" | "in_progress" | "completed" | "cancelled"
  assigned_to?: number
  due_date?: string
  notes?: string
}

// Tâches
export const getTasks = async (params?: {
  page?: number
  per_page?: number
  status?: string
  priority?: string
  type?: string
  assigned_to?: number
  search?: string
}): Promise<{ items: Task[]; pagination: any }> => {
  const response = await api.get("/tasks", { params })
  return response.data.data
}

export const getTask = async (id: number): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`)
  return response.data.data
}

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await api.post("/tasks", data)
  return response.data.data
}

export const updateTask = async (id: number, data: UpdateTaskData): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data)
  return response.data.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}

// Mes tâches
export const getMyTasks = async (params?: {
  page?: number
  per_page?: number
  status?: string
  priority?: string
}): Promise<{ items: Task[]; pagination: any }> => {
  const response = await api.get("/my-tasks", { params })
  return response.data.data
}

// Marquer une tâche comme terminée
export const completeTask = async (id: number): Promise<Task> => {
  const response = await api.put(`/tasks/${id}/complete`)
  return response.data.data
}
