import api from "./api"

export interface Cattle {
  id: number
  tag_number: string
  name?: string
  breed: string
  gender: "male" | "female"
  birth_date: string
  current_weight?: number
  zone_id: number
  zone?: {
    id: number
    name: string
  }
  mother_id?: number
  father_id?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface CattleRecord {
  id: number
  cattle_id: number
  cattle?: Cattle
  record_date: string
  milk_production?: number
  weight?: number
  health_status: "healthy" | "sick" | "injured" | "pregnant"
  health_notes?: string
  feeding_notes?: string
  observations?: string
  created_at: string
  updated_at: string
}

export interface CreateCattleData {
  tag_number: string
  name?: string
  breed: string
  gender: "male" | "female"
  birth_date: string
  current_weight?: number
  zone_id: number
  mother_id?: number
  father_id?: number
  notes?: string
}

export interface CreateCattleRecordData {
  cattle_id: number
  record_date: string
  milk_production?: number
  weight?: number
  health_status: "healthy" | "sick" | "injured" | "pregnant"
  health_notes?: string
  feeding_notes?: string
  observations?: string
}

// Bovins
export const getCattle = async (params?: {
  page?: number
  per_page?: number
  gender?: string
  breed?: string
  search?: string
}): Promise<{ items: Cattle[]; pagination: any }> => {
  const response = await api.get("/cattle", { params })
  return response.data.data
}

export const getCattleById = async (id: number): Promise<Cattle> => {
  const response = await api.get(`/cattle/${id}`)
  return response.data.data
}

export const createCattle = async (data: CreateCattleData): Promise<Cattle> => {
  const response = await api.post("/cattle", data)
  return response.data.data
}

export const updateCattle = async (id: number, data: Partial<CreateCattleData>): Promise<Cattle> => {
  const response = await api.put(`/cattle/${id}`, data)
  return response.data.data
}

export const deleteCattle = async (id: number): Promise<void> => {
  await api.delete(`/cattle/${id}`)
}

// Enregistrements bovins
export const getCattleRecords = async (params?: {
  page?: number
  per_page?: number
  cattle_id?: number
  start_date?: string
  end_date?: string
}): Promise<{ items: CattleRecord[]; pagination: any }> => {
  const response = await api.get("/cattle/records", { params })
  return response.data.data
}

export const createCattleRecord = async (data: CreateCattleRecordData): Promise<CattleRecord> => {
  const response = await api.post("/cattle/records", data)
  return response.data.data
}

// Analytics bovins
export const getCattleAnalytics = async (params?: {
  start_date?: string
  end_date?: string
  cattle_id?: number
}): Promise<any> => {
  const response = await api.get("/analytics/cattle", { params })
  return response.data.data
}
