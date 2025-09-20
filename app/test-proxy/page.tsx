"use client"

import { useState } from 'react'
import { Button } from '@/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/lib/components/ui/card'
import { useApi } from '@/lib/hooks/use-api'
import { CorsError } from '@/lib/components/ui/cors-error'
import { useCorsError } from '@/lib/hooks/use-cors-error'

export default function TestProxyPage() {
  const { api, apiMode, switchApiMode } = useApi()
  const { hasError, error, isTimeoutError, message, handleError, clearError, retry } = useCorsError()
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])

  const testEndpoints = [
    { name: 'Login Test', endpoint: '/login', method: 'POST', data: { email: 'test@example.com', password: 'test' } },
    { name: 'Auth Profile', endpoint: '/auth/profile', method: 'GET' },
    { name: 'Dashboard Stats', endpoint: '/dashboard/stats', method: 'GET' },
    { name: 'Users List', endpoint: '/users', method: 'GET' },
  ]

  const runTest = async (endpoint: string, method: string, name: string, data?: any) => {
    setIsLoading(true)
    clearError()
    
    try {
      let response
      if (method === 'GET') {
        response = await api.get(endpoint)
      } else if (method === 'POST') {
        response = await api.post(endpoint, data)
      }
      
      setTestResults(prev => [...prev, {
        name,
        endpoint,
        method,
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
        method,
        status: 'error',
        error: error.message,
        isTimeoutError: isTimeoutError(error),
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    for (const test of testEndpoints) {
      await runTest(test.endpoint, test.method, test.name, test.data)
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
          Test du Proxy API
        </h1>
        <p className="text-gray-600">
          Testez la connectivité via le proxy Next.js pour contourner les problèmes CORS
        </p>
      </div>

      {/* Sélecteur de mode API */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration API</CardTitle>
          <CardDescription>
            Choisissez le mode de connexion à l'API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              onClick={() => switchApiMode('proxy')}
              variant={apiMode === 'proxy' ? 'default' : 'outline'}
              className="flex-1"
            >
              🔄 Mode Proxy (Recommandé pour Vercel)
            </Button>
            <Button
              onClick={() => switchApiMode('direct')}
              variant={apiMode === 'direct' ? 'default' : 'outline'}
              className="flex-1"
            >
              🌐 Mode Direct (API Laravel)
            </Button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Mode actuel:</strong> {apiMode === 'proxy' ? 'Proxy Next.js' : 'API Laravel directe'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {apiMode === 'proxy' 
                ? 'Les requêtes passent par /api/proxy pour éviter les problèmes CORS'
                : 'Les requêtes vont directement vers l\'API Laravel (peut causer des erreurs CORS)'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Affichage des erreurs */}
      {hasError && (
        <CorsError
          error={error}
          onRetry={() => retry(() => runAllTests())}
          title={isTimeoutError ? "Timeout de connexion" : "Erreur de connexion"}
          description={message}
        />
      )}

      {/* Contrôles de test */}
      <Card>
        <CardHeader>
          <CardTitle>Tests de Connectivité</CardTitle>
          <CardDescription>
            Testez différents endpoints via le mode {apiMode === 'proxy' ? 'proxy' : 'direct'}
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
                key={`${test.endpoint}-${test.method}`}
                onClick={() => runTest(test.endpoint, test.method, test.name, test.data)}
                disabled={isLoading}
                variant="outline"
                className="justify-start"
              >
                {test.name} ({test.method})
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
              {testResults.length} test(s) effectué(s) en mode {apiMode}
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
                      <p className="text-sm text-gray-600">{result.method} {result.endpoint}</p>
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
                      {result.isTimeoutError && (
                        <p className="text-red-600 font-medium">
                          🚨 Timeout détecté
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

      {/* Informations sur le proxy */}
      <Card>
        <CardHeader>
          <CardTitle>Comment fonctionne le Proxy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">🔄 Mode Proxy (Recommandé)</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Les requêtes passent par <code>/api/proxy</code> dans Next.js</li>
                <li>Next.js fait la requête vers l'API Laravel côté serveur</li>
                <li>Pas de problème CORS car c'est serveur → serveur</li>
                <li>Headers CORS ajoutés automatiquement par Next.js</li>
              </ul>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">🌐 Mode Direct</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Les requêtes vont directement vers l'API Laravel</li>
                <li>Peut causer des erreurs CORS en production</li>
                <li>Fonctionne bien en développement local</li>
                <li>Dépend de la configuration CORS du serveur Laravel</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
