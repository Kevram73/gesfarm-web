"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"

interface ToastProps {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, title, description, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 100)
    
    // Auto-close
    const autoCloseTimer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(autoCloseTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500'
      case 'error':
        return 'border-l-red-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'info':
        return 'border-l-blue-500'
      default:
        return 'border-l-gray-500'
    }
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBorderColor()} border-l-4
      `}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white">
              {title}
            </h4>
            {description && (
              <p className="mt-1 text-sm text-gray-300">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook pour gérer les toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }
    }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, description?: string) => {
    addToast({ title, description, type: 'success' })
  }

  const error = (title: string, description?: string) => {
    addToast({ title, description, type: 'error' })
  }

  const warning = (title: string, description?: string) => {
    addToast({ title, description, type: 'warning' })
  }

  const info = (title: string, description?: string) => {
    addToast({ title, description, type: 'info' })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

// Composant pour afficher tous les toasts
export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}