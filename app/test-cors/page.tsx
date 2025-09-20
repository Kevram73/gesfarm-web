"use client"

import { useState } from 'react'
import { CorsError } from '@/lib/components/ui/cors-error'
import { useCorsError } from '@/lib/hooks/use-cors-error'
import { Button } from '@/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card'
import api from '@/lib/services/api'

export default function TestCorsPage() {
  const { hasError, error, isCorsError, message, handleError, clearError, retry } = useCorsError()
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])

  const testEndpoints = [
    { name: 'Auth Profile', endpoint: '/auth/profile' },
    { name: 'Dashboard Stats', endpoint: '/dashboard/stats' },
    { name: 'Users List', endpoint: '/users' },
    { name: 'Cattle List', endpoint: '/cattle' },
  ]

  const runTest = async (endpoint: string, name: string) => {
    setIsLoading(true)
    clearError()
    
    try {
      const response = await api.get(endpoint)
      setTestResults(prev => [...prev, {
        name,
        endpoint,
        status: 'success',
        statusCode: response.status,
        data: response.data,
        timestamp: new Date().toISOString(),
      }])
    } catch (error: any) {
      handleError(error)
      setTestResults(prev => [...prev, {
        name,
        endpoint,
        status: 'error',
        error: error.message,
        isCorsError: isCorsError(error),
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    for (const test of testEndpoints) {
      await runTest(test.endpoint, test.name)
      // Petite pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  const clearResults = () => {
    setTestResults([])
    clearError()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Test de Configuration CORS
        </h1>
        <p className="text-gray-600">
          Testez la connectivité avec l'API GesFarm et vérifiez la configuration CORS
        </p>
      </div>

      {/* Affichage des erreurs CORS */}
      {hasError && (
        <CorsError
          error={error}
          onRetry={() => retry(() => runAllTests())}
          title={isCorsError ? "Erreur CORS détectée" : "Erreur de connexion"}
          description={message}
        />
      )}

      {/* Contrôles de test */}
      <Card>
        <CardHeader>
          <CardTitle>Tests de Connectivité</CardTitle>
          <CardDescription>
            Testez différents endpoints de l'API pour vérifier la configuration CORS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={runAllTests}
              disabled={isLoading}
              className="flex-1 min-w-[200px]"
            >
              {isLoading ? 'Test en cours...' : 'Lancer tous les tests'}
            </Button>
            <Button 
              onClick={clearResults}
              variant="outline"
              disabled={isLoading}
            >
              Effacer les résultats
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {testEndpoints.map((test) => (
              <Button
                key={test.endpoint}
                onClick={() => runTest(test.endpoint, test.name)}
                disabled={isLoading}
                variant="outline"
                className="justify-start"
              >
                {test.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats des Tests</CardTitle>
            <CardDescription>
              {testResults.length} test(s) effectué(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.status === 'success'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <p className="text-sm text-gray-600">{result.endpoint}</p>
                    </div>
                    <div className="text-right">
                      {result.status === 'success' ? (
                        <span className="text-green-600 font-medium">
                          ✅ {result.statusCode}
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          ❌ Erreur
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {result.status === 'error' && (
                    <div className="mt-2 text-sm">
                      <p className="text-red-700">{result.error}</p>
                      {result.isCorsError && (
                        <p className="text-red-600 font-medium">
                          🚨 Erreur CORS détectée
                        </p>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations de configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration CORS Actuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>API Base URL:</strong> https://farm.pressingelegance.com/api</p>
            <p><strong>Origin autorisé:</strong> * (tous les domaines)</p>
            <p><strong>Méthodes autorisées:</strong> GET, POST, PUT, DELETE, OPTIONS, PATCH</p>
            <p><strong>Headers autorisés:</strong> Content-Type, Authorization, X-Requested-With, Accept, Origin</p>
            <p><strong>Credentials:</strong> Activés</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
