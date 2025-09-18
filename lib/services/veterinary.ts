import api from "./api"

export interface Treatment {
  id: number
  treatment_type: "vaccination" | "medication" | "surgery" | "checkup" | "other"
  treatment_name: string
  description: string
  treatment_date: string
  animal_type: "cattle" | "poultry" | "other"
  animal_id: number
  animal?: {
    id: number
    name?: string
    tag_number?: string
    flock_number?: string
  }
  veterinarian_name: string
  veterinarian_contact?: string
  cost: number
  next_treatment_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface TreatmentSchedule {
  id: number
  animal_id: number
  animal_type: "cattle" | "poultry"
  treatment_type: string
  scheduled_date: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
}

export interface AnimalHistory {
  animal_id: number
  animal_type: "cattle" | "poultry"
  treatments: Treatment[]
  total_cost: number
  last_treatment_date?: string
  next_scheduled_treatment?: TreatmentSchedule
}

export interface CreateTreatmentData {
  treatment_type: "vaccination" | "medication" | "surgery" | "checkup" | "other"
  treatment_name: string
  description: string
  treatment_date: string
  animal_type: "cattle" | "poultry" | "other"
  animal_id: number
  veterinarian_name: string
  veterinarian_contact?: string
  cost: number
  next_treatment_date?: string
  notes?: string
}

// Traitements
export const getTreatments = async (params?: {
  page?: number
  per_page?: number
  treatment_type?: string
  animal_type?: string
  animal_id?: number
  start_date?: string
  end_date?: string
}): Promise<{ items: Treatment[]; pagination: any }> => {
  const response = await api.get("/veterinary/treatments", { params })
  return response.data.data
}

export const getTreatment = async (id: number): Promise<Treatment> => {
  const response = await api.get(`/veterinary/treatments/${id}`)
  return response.data.data
}

export const createTreatment = async (data: CreateTreatmentData): Promise<Treatment> => {
  const response = await api.post("/veterinary/treatments", data)
  return response.data.data
}

export const updateTreatment = async (id: number, data: Partial<CreateTreatmentData>): Promise<Treatment> => {
  const response = await api.put(`/veterinary/treatments/${id}`, data)
  return response.data.data
}

export const deleteTreatment = async (id: number): Promise<void> => {
  await api.delete(`/veterinary/treatments/${id}`)
}

// Planning des soins
export const getTreatmentSchedule = async (params?: {
  start_date?: string
  end_date?: string
  animal_type?: string
}): Promise<TreatmentSchedule[]> => {
  const response = await api.get("/veterinary/schedule", { params })
  return response.data.data
}

// Rappels de soins
export const getTreatmentReminders = async (params?: {
  days_ahead?: number
  animal_type?: string
}): Promise<TreatmentSchedule[]> => {
  const response = await api.get("/veterinary/reminders", { params })
  return response.data.data
}

// Historique médical d'un animal
export const getAnimalHistory = async (animalId: number, animalType: "cattle" | "poultry"): Promise<AnimalHistory> => {
  const response = await api.get("/veterinary/animal-history", { 
    params: { animal_id: animalId, animal_type: animalType }
  })
  return response.data.data
}

// Statistiques vétérinaires
export const getVeterinaryStats = async (params?: {
  start_date?: string
  end_date?: string
  animal_type?: string
}): Promise<any> => {
  const response = await api.get("/veterinary/stats", { params })
  return response.data.data
}
