"use client"

import { useState, useCallback } from 'react'
import { isCorsError, isTimeoutError, handleCorsError } from '../utils/cors'

export interface CorsErrorState {
  hasError: boolean
  error: any | null
  isCorsError: boolean
  isTimeoutError: boolean
  message: string
}

export function useCorsError() {
  const [errorState, setErrorState] = useState<CorsErrorState>({
    hasError: false,
    error: null,
    isCorsError: false,
    isTimeoutError: false,
    message: '',
  })

  const handleError = useCallback((error: any) => {
    const corsError = isCorsError(error)
    const timeoutError = isTimeoutError(error)
    const message = handleCorsError(error)
    
    setErrorState({
      hasError: true,
      error,
      isCorsError: corsError,
      isTimeoutError: timeoutError,
      message,
    })
    
    // Log l'erreur pour le debugging
    console.error('Erreur détectée:', {
      error,
      isCorsError: corsError,
      isTimeoutError: timeoutError,
      message,
    })
  }, [])

  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      isCorsError: false,
      isTimeoutError: false,
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
