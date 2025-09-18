import api from "./api"

export interface Zone {
  id: number
  name: string
  description?: string
  type: "cultivation" | "livestock" | "storage" | "building" | "other"
  coordinates?: {
    type: "Polygon" | "Point"
    coordinates: number[][]
  }
  area?: number
  created_at: string
  updated_at: string
}

export interface CreateZoneData {
  name: string
  description?: string
  type: "cultivation" | "livestock" | "storage" | "building" | "other"
  coordinates?: {
    type: "Polygon" | "Point"
    coordinates: number[][]
  }
  area?: number
}

export interface ZoneStatistics {
  zone_id: number
  zone_name: string
  total_crops: number
  total_cattle: number
  total_poultry: number
  total_area: number
  production_summary: {
    crops_yield: number
    milk_production: number
    eggs_production: number
  }
}

// Zones
export const getZones = async (params?: {
  page?: number
  per_page?: number
  type?: string
  search?: string
}): Promise<{ items: Zone[]; pagination: any }> => {
  const response = await api.get("/zones", { params })
  return response.data.data
}

export const getZone = async (id: number): Promise<Zone> => {
  const response = await api.get(`/zones/${id}`)
  return response.data.data
}

export const createZone = async (data: CreateZoneData): Promise<Zone> => {
  const response = await api.post("/zones", data)
  return response.data.data
}

export const updateZone = async (id: number, data: Partial<CreateZoneData>): Promise<Zone> => {
  const response = await api.put(`/zones/${id}`, data)
  return response.data.data
}

export const deleteZone = async (id: number): Promise<void> => {
  await api.delete(`/zones/${id}`)
}

// Statistiques des zones
export const getZoneStatistics = async (id: number): Promise<ZoneStatistics> => {
  const response = await api.get(`/zones/${id}/statistics`)
  return response.data.data
}
