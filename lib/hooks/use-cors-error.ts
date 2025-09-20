"use client"

import { useState, useCallback } from 'react'
import { isCorsError, handleCorsError } from '../utils/cors'

export interface CorsErrorState {
  hasError: boolean
  error: any | null
  isCorsError: boolean
  message: string
}

export function useCorsError() {
  const [errorState, setErrorState] = useState<CorsErrorState>({
    hasError: false,
    error: null,
    isCorsError: false,
    message: '',
  })

  const handleError = useCallback((error: any) => {
    const corsError = isCorsError(error)
    const message = handleCorsError(error)
    
    setErrorState({
      hasError: true,
      error,
      isCorsError: corsError,
      message,
    })
    
    // Log l'erreur pour le debugging
    console.error('Erreur CORS détectée:', {
      error,
      isCorsError: corsError,
      message,
    })
  }, [])

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      isCorsError: false,
      message: '',
    })
  }, [])

  const retry = useCallback(async (retryFn: () => Promise<any>) => {
    clearError()
    try {
      return await retryFn()
    } catch (error) {
      handleError(error)
      throw error
    }
  }, [clearError, handleError])

  return {
    ...errorState,
    handleError,
    clearError,
    retry,
  }
}
