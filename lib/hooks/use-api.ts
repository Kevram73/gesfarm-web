"use client"

import { useState, useEffect } from 'react'
import api from '../services/api'
import apiProxy from '../services/api-proxy'

export type ApiMode = 'direct' | 'proxy'

export function useApi() {
  const [apiMode, setApiMode] = useState<ApiMode>('proxy') // Par défaut, utiliser le proxy
  const [isLoading, setIsLoading] = useState(false)

  // Détecter automatiquement le mode API basé sur l'environnement
  useEffect(() => {
    // En production (Vercel), utiliser le proxy par défaut
    if (typeof window !== 'undefined') {
      const isProduction = window.location.hostname.includes('vercel.app')
      setApiMode(isProduction ? 'proxy' : 'direct')
    }
  }, [])

  const getApi = () => {
    return apiMode === 'proxy' ? apiProxy : api
  }

  const switchApiMode = (mode: ApiMode) => {
    setApiMode(mode)
    // Sauvegarder le choix dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('gesfarm_api_mode', mode)
    }
  }

  // Charger le mode sauvegardé
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('gesfarm_api_mode') as ApiMode
      if (savedMode && (savedMode === 'direct' || savedMode === 'proxy')) {
        setApiMode(savedMode)
      }
    }
  }, [])

  return {
    api: getApi(),
    apiMode,
    switchApiMode,
    isLoading,
    setIsLoading,
  }
}
