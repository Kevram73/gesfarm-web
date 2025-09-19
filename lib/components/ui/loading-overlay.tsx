"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
}

export function LoadingOverlay({ isLoading, message = "Chargement..." }: LoadingOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!isVisible) return null

  return (
    <div className={`
      fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center
      transition-opacity duration-300
      ${isLoading ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-white font-medium">{message}</span>
        </div>
      </div>
    </div>
  )
}

// Hook pour gérer le loading global
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("Chargement...")

  const startLoading = (loadingMessage?: string) => {
    if (loadingMessage) {
      setMessage(loadingMessage)
    }
    setIsLoading(true)
  }

  const stopLoading = () => {
    setIsLoading(false)
  }

  const withLoading = async <T,>(
    asyncFn: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> => {
    try {
      startLoading(loadingMessage)
      const result = await asyncFn()
      return result
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    withLoading
  }
}