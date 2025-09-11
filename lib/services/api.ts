import axios from "axios"

// Configuration de base pour axios - API GESFARM Laravel
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
})

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem("gesfarm_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Gérer les erreurs globalement
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion
      localStorage.removeItem("gesfarm_token")
      localStorage.removeItem("gesfarm_user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default api
