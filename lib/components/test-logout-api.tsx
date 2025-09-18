"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { LogOut, CheckCircle, XCircle } from "lucide-react"
import api from "@/lib/services/api"
import toast from "react-hot-toast"

export function TestLogoutApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testLogout = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      console.log("Test de l'API logout...")
      const response = await api.post("/logout")
      console.log("Réponse logout:", response.data)
      
      setResult({
        success: true,
        data: response.data,
        status: response.status
      })
      
      toast.success("API logout fonctionne !")
    } catch (error: any) {
      console.error("Erreur API logout:", error)
      
      setResult({
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status
      })
      
      toast.error(`Erreur API logout: ${error.response?.data?.message || error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LogOut className="h-5 w-5 mr-2" />
          Test API Logout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testLogout} 
          disabled={isLoading}
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isLoading ? "Test en cours..." : "Tester l'API Logout"}
        </Button>

        {result && (
          <div className={`p-3 rounded ${
            result.success ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <div className="flex items-center mb-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className={`font-semibold ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'Succès' : 'Erreur'}
              </span>
            </div>
            
            <div className="text-sm">
              <p><strong>Status:</strong> {result.status}</p>
              {result.success ? (
                <div>
                  <p><strong>Message:</strong> {result.data?.message}</p>
                  <p><strong>Status API:</strong> {result.data?.status}</p>
                </div>
              ) : (
                <div>
                  <p><strong>Erreur:</strong> {result.error?.message || result.error}</p>
                </div>
              )}
            </div>
            
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium">
                Détails complets
              </summary>
              <pre className="text-xs mt-2 overflow-auto bg-white p-2 rounded border">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
