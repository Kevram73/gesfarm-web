import api from "./api"

export interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface CreateUserData {
  name: string
  email: string
  phone?: string
  website?: string
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: number
}

// Récupérer tous les utilisateurs
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users")
  return response.data
}

// Récupérer un utilisateur par ID
export const getUser = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

// Créer un nouvel utilisateur
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const response = await api.post("/users", userData)
  return response.data
}

// Mettre à jour un utilisateur
export const updateUser = async (userData: UpdateUserData): Promise<User> => {
  const { id, ...data } = userData
  const response = await api.put(`/users/${id}`, data)
  return response.data
}

// Supprimer un utilisateur
export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`)
}
