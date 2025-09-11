import api from "./api"

export interface StockCategory {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface StockItem {
  id: number
  name: string
  description?: string
  sku: string
  category_id: number
  category?: StockCategory
  unit: string
  current_quantity: number
  minimum_quantity: number
  unit_cost: number
  supplier?: string
  expiry_date?: string
  created_at: string
  updated_at: string
}

export interface StockMovement {
  id: number
  stock_item_id: number
  stock_item?: StockItem
  type: "in" | "out"
  quantity: number
  reason: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateStockItemData {
  name: string
  description?: string
  sku: string
  category_id: number
  unit: string
  current_quantity: number
  minimum_quantity: number
  unit_cost: number
  supplier?: string
  expiry_date?: string
}

export interface CreateStockMovementData {
  stock_item_id: number
  type: "in" | "out"
  quantity: number
  reason: string
  notes?: string
}

// Catégories de stock
export const getStockCategories = async (): Promise<StockCategory[]> => {
  const response = await api.get("/stock/categories")
  return response.data.data
}

// Articles de stock
export const getStockItems = async (params?: {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
}): Promise<{ items: StockItem[]; pagination: any }> => {
  const response = await api.get("/stock/items", { params })
  return response.data.data
}

export const getStockItem = async (id: number): Promise<StockItem> => {
  const response = await api.get(`/stock/items/${id}`)
  return response.data.data
}

export const createStockItem = async (data: CreateStockItemData): Promise<StockItem> => {
  const response = await api.post("/stock/items", data)
  return response.data.data
}

export const updateStockItem = async (id: number, data: Partial<CreateStockItemData>): Promise<StockItem> => {
  const response = await api.put(`/stock/items/${id}`, data)
  return response.data.data
}

export const deleteStockItem = async (id: number): Promise<void> => {
  await api.delete(`/stock/items/${id}`)
}

// Mouvements de stock
export const getStockMovements = async (params?: {
  page?: number
  per_page?: number
  stock_item_id?: number
  type?: "in" | "out"
}): Promise<{ items: StockMovement[]; pagination: any }> => {
  const response = await api.get("/stock/movements", { params })
  return response.data.data
}

export const createStockMovement = async (data: CreateStockMovementData): Promise<StockMovement> => {
  const response = await api.post("/stock/movements", data)
  return response.data.data
}

// Alertes de stock
export const getStockAlerts = async (): Promise<StockItem[]> => {
  const response = await api.get("/stock/alerts")
  return response.data.data
}
