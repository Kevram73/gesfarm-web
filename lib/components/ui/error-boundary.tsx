"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

function ErrorFallback({ error }: { error?: Error }) {
  const router = useRouter()

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Oups ! Quelque chose s'est mal passé
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            Une erreur inattendue s'est produite. Veuillez réessayer ou contacter le support si le problème persiste.
          </p>
          
          {error && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Détails de l'erreur
              </summary>
              <pre className="mt-2 text-xs text-gray-400 bg-gray-100 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualiser
            </Button>
            <Button
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook pour gérer les erreurs dans les composants fonctionnels
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error) => {
    setError(error)
    console.error("Error caught by useErrorHandler:", error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, clearError }
}