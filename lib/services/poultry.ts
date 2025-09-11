import api from "./api"

export interface PoultryFlock {
  id: number
  flock_number: string
  type: "layer" | "broiler" | "duck" | "turkey"
  breed: string
  initial_quantity: number
  current_quantity: number
  arrival_date: string
  zone_id: number
  zone?: {
    id: number
    name: string
  }
  notes?: string
  created_at: string
  updated_at: string
}

export interface PoultryRecord {
  id: number
  flock_id: number
  flock?: PoultryFlock
  record_date: string
  eggs_collected?: number
  feed_consumed?: number
  mortality_count?: number
  average_weight?: number
  health_notes?: string
  observations?: string
  created_at: string
  updated_at: string
}

export interface IncubationRecord {
  id: number
  batch_number: string
  egg_type: "chicken" | "duck" | "turkey"
  breed: string
  egg_count: number
  start_date: string
  incubation_days: number
  temperature: number
  humidity_percentage: number
  egg_size: "small" | "medium" | "large" | "extra_large"
  expected_hatch_date: string
  actual_hatch_count?: number
  hatch_rate?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreatePoultryFlockData {
  flock_number: string
  type: "layer" | "broiler" | "duck" | "turkey"
  breed: string
  initial_quantity: number
  arrival_date: string
  zone_id: number
  notes?: string
}

export interface CreatePoultryRecordData {
  flock_id: number
  record_date: string
  eggs_collected?: number
  feed_consumed?: number
  mortality_count?: number
  average_weight?: number
  health_notes?: string
  observations?: string
}

export interface CreateIncubationRecordData {
  batch_number: string
  egg_type: "chicken" | "duck" | "turkey"
  breed: string
  egg_count: number
  start_date: string
  incubation_days: number
  temperature: number
  humidity_percentage: number
  egg_size: "small" | "medium" | "large" | "extra_large"
  notes?: string
}

// Lots de volailles
export const getPoultryFlocks = async (params?: {
  page?: number
  per_page?: number
  type?: string
  search?: string
}): Promise<{ items: PoultryFlock[]; pagination: any }> => {
  const response = await api.get("/poultry/flocks", { params })
  return response.data.data
}

export const getPoultryFlock = async (id: number): Promise<PoultryFlock> => {
  const response = await api.get(`/poultry/flocks/${id}`)
  return response.data.data
}

export const createPoultryFlock = async (data: CreatePoultryFlockData): Promise<PoultryFlock> => {
  const response = await api.post("/poultry/flocks", data)
  return response.data.data
}

export const updatePoultryFlock = async (id: number, data: Partial<CreatePoultryFlockData>): Promise<PoultryFlock> => {
  const response = await api.put(`/poultry/flocks/${id}`, data)
  return response.data.data
}

export const deletePoultryFlock = async (id: number): Promise<void> => {
  await api.delete(`/poultry/flocks/${id}`)
}

// Enregistrements avicoles
export const getPoultryRecords = async (params?: {
  page?: number
  per_page?: number
  flock_id?: number
  start_date?: string
  end_date?: string
}): Promise<{ items: PoultryRecord[]; pagination: any }> => {
  const response = await api.get("/poultry/records", { params })
  return response.data.data
}

export const createPoultryRecord = async (data: CreatePoultryRecordData): Promise<PoultryRecord> => {
  const response = await api.post("/poultry/records", data)
  return response.data.data
}

// Incubation
export const getIncubationRecords = async (params?: {
  page?: number
  per_page?: number
  egg_type?: string
}): Promise<{ items: IncubationRecord[]; pagination: any }> => {
  const response = await api.get("/poultry/incubation", { params })
  return response.data.data
}

export const createIncubationRecord = async (data: CreateIncubationRecordData): Promise<IncubationRecord> => {
  const response = await api.post("/poultry/incubation", data)
  return response.data.data
}

// Analytics avicoles
export const getPoultryAnalytics = async (params?: {
  start_date?: string
  end_date?: string
  flock_id?: number
}): Promise<any> => {
  const response = await api.get("/analytics/poultry", { params })
  return response.data.data
}
