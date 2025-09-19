"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authService, LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData } from "@/lib/services/auth"
import { useAuthGlobal, setAuthData } from "@/lib/hooks/use-auth-global"
import { toast } from "react-hot-toast"

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Connexion
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login(credentials)
      
      // Sauvegarder les données d'authentification
      setAuthData({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
      })

      toast.success(response.message || "Connexion réussie !")
      router.push("/dashboard")
      
      return response
    } catch (error: any) {
      const errorMessage = error.message || "Erreur de connexion. Veuillez réessayer."
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Inscription
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.register(data)
      
      // Sauvegarder les données d'authentification
      setAuthData({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
      })

      toast.success(response.message || "Inscription réussie !")
      router.push("/dashboard")
      
      return response
    } catch (error: any) {
      const errorMessage = error.message || "Erreur d'inscription. Veuillez réessayer."
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Déconnexion
  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      await authService.logout()
    } catch (error) {
      console.warn("Erreur lors de la déconnexion:", error)
    } finally {
      // Déconnecter l'utilisateur localement même si l'API échoue
      setAuthData({
        isAuthenticated: false,
        user: null,
        token: null,
      })
      
      toast.success("Déconnexion réussie")
      router.push("/")
      setIsLoading(false)
    }
  }, [router])

  // Mot de passe oublié
  const forgotPassword = useCallback(async (data: ForgotPasswordData) => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.forgotPassword(data)
      toast.success("Email de réinitialisation envoyé !")
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors de l'envoi de l'email."
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Réinitialiser le mot de passe
  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    setIsLoading(true)
    setError(null)

    try {
      await authService.resetPassword(data)
      toast.success("Mot de passe réinitialisé avec succès !")
      router.push("/")
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors de la réinitialisation du mot de passe."
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // Rafraîchir le token
  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken()
      
      // Mettre à jour le token
      setAuthData({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
      })
      
      return response
    } catch (error: any) {
      // Si le refresh échoue, déconnecter l'utilisateur
      setAuthData({
        isAuthenticated: false,
        user: null,
        token: null,
      })
      
      router.push("/")
      throw error
    }
  }, [router])

  // Vérifier l'authentification
  const checkAuth = useCallback(async () => {
    try {
      const isAuthenticated = await authService.checkAuth()
      return isAuthenticated
    } catch (error) {
      return false
    }
  }, [])

  return {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    refreshToken,
    checkAuth,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}