import axios from "axios"

// Configuration de base pour axios - API GESFARM Laravel
const api = axios.create({
  baseURL: "https://farm.pressingelegance.com/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // Important pour Laravel Sanctum
})

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem("gesfarm_auth")
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          if (parsed.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`
          }
        } catch (error) {
          console.error("Erreur lors du parsing des données d'authentification:", error)
        }
      }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem("gesfarm_auth")
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  }
)

export default api
