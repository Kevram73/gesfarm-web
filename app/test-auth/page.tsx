"use client"

import { useState, useEffect } from "react"
import { useAuthGlobal, useAuthData } from "@/lib/hooks/use-auth-global"
import { useAuth } from "@/lib/hooks/use-auth"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw, LogOut } from "lucide-react"

export default function TestAuthPage() {
  const [testResults, setTestResults] = useState<any>({})
  const isAuthenticated = useAuthGlobal()
  const authData = useAuthData()
  const { logout, checkAuth } = useAuth()

  const runTests = async () => {
    const results: any = {}

    // Test 1: Vérifier l'état d'authentification
    results.isAuthenticated = {
      expected: true,
      actual: isAuthenticated,
      passed: isAuthenticated === true
    }

    // Test 2: Vérifier les données utilisateur
    results.userData = {
      expected: "object with user info",
      actual: authData.user,
      passed: !!authData.user && !!authData.user.id
    }

    // Test 3: Vérifier le token
    results.token = {
      expected: "string token",
      actual: authData.token ? "Token présent" : "Aucun token",
      passed: !!authData.token
    }

    // Test 4: Vérifier les rôles
    results.roles = {
      expected: "array of roles",
      actual: authData.user?.roles || [],
      passed: Array.isArray(authData.user?.roles) && authData.user.roles.length > 0
    }

    // Test 5: Vérifier l'API
    try {
      const apiCheck = await checkAuth()
      results.apiCheck = {
        expected: true,
        actual: apiCheck,
        passed: apiCheck === true
      }
    } catch (error) {
      results.apiCheck = {
        expected: true,
        actual: false,
        passed: false,
        error: error
      }
    }

    // Test 6: Vérifier le localStorage
    const storedAuth = localStorage.getItem("gesfarm_auth")
    results.localStorage = {
      expected: "stored auth data",
      actual: storedAuth ? "Données présentes" : "Aucune donnée",
      passed: !!storedAuth
    }

    setTestResults(results)
  }

  useEffect(() => {
    runTests()
  }, [isAuthenticated, authData])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <LayoutSimple>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Test d'Authentification</h1>
            <p className="text-gray-300 mt-2">
              Vérification du système d'authentification basé sur les tokens
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={runTests} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Relancer les tests
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Résumé */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Résumé des Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Object.values(testResults).filter((test: any) => test.passed).length}
                </div>
                <div className="text-sm text-gray-400">Tests réussis</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {Object.values(testResults).filter((test: any) => !test.passed).length}
                </div>
                <div className="text-sm text-gray-400">Tests échoués</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {Object.keys(testResults).length}
                </div>
                <div className="text-sm text-gray-400">Tests total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails des tests */}
        <div className="grid gap-4">
          {Object.entries(testResults).map(([testName, test]: [string, any]) => (
            <Card key={testName} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white capitalize">
                    {testName.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                  {test.passed ? (
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Réussi
                    </Badge>
                  ) : (
                    <Badge className="bg-red-600 text-white">
                      <XCircle className="mr-1 h-3 w-3" />
                      Échoué
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm text-gray-400">Attendu:</span>
                  <span className="ml-2 text-white">{JSON.stringify(test.expected)}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Obtenu:</span>
                  <span className="ml-2 text-white">{JSON.stringify(test.actual)}</span>
                </div>
                {test.error && (
                  <div>
                    <span className="text-sm text-gray-400">Erreur:</span>
                    <span className="ml-2 text-red-400">{test.error.message}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informations de debug */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Données d'Authentification</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-gray-300 bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(authData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </LayoutSimple>
  )
}