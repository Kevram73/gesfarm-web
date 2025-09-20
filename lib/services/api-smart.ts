import axios from "axios"
import { handleCorsError, isCorsError, isTimeoutError } from "../utils/cors"

// Fonction pour déterminer l'URL de base selon l'environnement
function getBaseURL() {
  if (typeof window === 'undefined') {
    // Côté serveur, toujours utiliser l'API directe
    return "https://farm.pressingelegance.com/api"
  }
  
  // Côté client
  const isProduction = window.location.hostname.includes('vercel.app')
  const savedMode = localStorage.getItem('gesfarm_api_mode')
  
  if (isProduction && savedMode !== 'direct') {
    // En production, utiliser le proxy par défaut
    return "/api/proxy"
  } else if (savedMode === 'proxy') {
    // Mode proxy forcé
    return "/api/proxy"
  } else {
    // Mode direct (local ou forcé)
    return "https://farm.pressingelegance.com/api"
  }
}

// Configuration intelligente pour axios
const apiSmart = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
})

// Intercepteur pour les requêtes
apiSmart.interceptors.request.use(
  (config) => {
    // Mettre à jour l'URL de base si nécessaire
    config.baseURL = getBaseURL()
    
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
apiSmart.interceptors.response.use(
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

export default apiSmart
