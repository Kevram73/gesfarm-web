import api from "./api"

export interface Crop {
  id: number
  name: string
  variety: string
  zone_id: number
  zone?: {
    id: number
    name: string
  }
  planting_date: string
  expected_harvest_date?: string
  actual_harvest_date?: string
  planted_area: number
  expected_yield?: number
  actual_yield?: number
  status: "planted" | "growing" | "harvested" | "failed"
  notes?: string
  created_at: string
  updated_at: string
}

export interface CropActivity {
  id: number
  crop_id: number
  crop?: Crop
  activity_type: "planting" | "watering" | "fertilizing" | "pest_control" | "harvesting" | "other"
  activity_date: string
  description: string
  materials_used?: Array<{
    item_id: number
    quantity: number
    unit: string
  }>
  cost?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateCropData {
  name: string
  variety: string
  zone_id: number
  planting_date: string
  expected_harvest_date?: string
  planted_area: number
  expected_yield?: number
  notes?: string
}

export interface CreateCropActivityData {
  crop_id: number
  activity_type: "planting" | "watering" | "fertilizing" | "pest_control" | "harvesting" | "other"
  activity_date: string
  description: string
  materials_used?: Array<{
    item_id: number
    quantity: number
    unit: string
  }>
  cost?: number
  notes?: string
}

// Cultures
export const getCrops = async (params?: {
  page?: number
  per_page?: number
  status?: string
  zone_id?: number
  search?: string
}): Promise<{ items: Crop[]; pagination: any }> => {
  const response = await api.get("/crops", { params })
  return response.data.data
}

export const getCrop = async (id: number): Promise<Crop> => {
  const response = await api.get(`/crops/${id}`)
  return response.data.data
}

export const createCrop = async (data: CreateCropData): Promise<Crop> => {
  const response = await api.post("/crops", data)
  return response.data.data
}

export const updateCrop = async (id: number, data: Partial<CreateCropData>): Promise<Crop> => {
  const response = await api.put(`/crops/${id}`, data)
  return response.data.data
}

export const deleteCrop = async (id: number): Promise<void> => {
  await api.delete(`/crops/${id}`)
}

// Activités culturales
export const getCropActivities = async (params?: {
  page?: number
  per_page?: number
  crop_id?: number
  activity_type?: string
  start_date?: string
  end_date?: string
}): Promise<{ items: CropActivity[]; pagination: any }> => {
  const response = await api.get("/crops/activities", { params })
  return response.data.data
}

export const createCropActivity = async (data: CreateCropActivityData): Promise<CropActivity> => {
  const response = await api.post("/crops/activities", data)
  return response.data.data
}

// Analytics cultures
export const getCropsAnalytics = async (params?: {
  start_date?: string
  end_date?: string
  crop_id?: number
}): Promise<any> => {
  const response = await api.get("/analytics/crops", { params })
  return response.data.data
}
