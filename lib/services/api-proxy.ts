import axios from "axios"
import { handleCorsError, isCorsError, isTimeoutError } from "../utils/cors"

// Configuration pour utiliser le proxy Next.js au lieu de l'API directe
const apiProxy = axios.create({
  baseURL: "/api/proxy", // Utilise le proxy Next.js
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
})

// Intercepteur pour les requêtes
apiProxy.interceptors.request.use(
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
apiProxy.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Gérer les timeouts
    if (isTimeoutError(error)) {
      console.error("Timeout détecté:", error)
      error.timeoutError = true
      error.message = handleCorsError(error)
    }
    // Gérer les erreurs CORS
    else if (isCorsError(error)) {
      console.error("Erreur CORS détectée:", error)
      error.corsError = true
      error.message = handleCorsError(error)
    }
    // Gérer les autres erreurs
    else {
      error.message = handleCorsError(error)
    }
    
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

export default apiProxy
