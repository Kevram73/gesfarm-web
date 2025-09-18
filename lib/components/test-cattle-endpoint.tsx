"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import api from "@/lib/services/api"

export function TestCattleEndpoint() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testCattleEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      console.log("Testing cattle endpoint...")
      const response = await api.get("/cattle?per_page=20")
      console.log("Cattle response:", response)
      setResult({
        success: true,
        data: response.data,
        status: response.status,
        headers: response.headers
      })
    } catch (error: any) {
      console.error("Cattle endpoint error:", error)
      setError(error.response?.data || error.message)
      setResult({
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
        headers: error.response?.headers
      })
    }
    setLoading(false)
  }

  const testWithoutAuth = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      console.log("Testing cattle endpoint without auth...")
      const response = await fetch("http://localhost:8000/api/cattle?per_page=20")
      const data = await response.json()
      console.log("Cattle response (no auth):", data)
      setResult({
        success: response.ok,
        data: data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error: any) {
      console.error("Cattle endpoint error (no auth):", error)
      setError(error.message)
      setResult({
        success: false,
        error: error.message,
        status: 0
      })
    }
    setLoading(false)
  }

  const testHealthEndpoint = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      console.log("Testing health endpoint...")
      const response = await fetch("http://localhost:8000/api/health")
      const data = await response.json()
      console.log("Health response:", data)
      setResult({
        success: response.ok,
        data: data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      })
    } catch (error: any) {
      console.error("Health endpoint error:", error)
      setError(error.message)
      setResult({
        success: false,
        error: error.message,
        status: 0
      })
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Test Endpoint Cattle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testCattleEndpoint}
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Test..." : "Test /api/cattle (avec auth)"}
          </Button>
          <Button 
            onClick={testWithoutAuth}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            {loading ? "Test..." : "Test /api/cattle (sans auth)"}
          </Button>
          <Button 
            onClick={testHealthEndpoint}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            {loading ? "Test..." : "Test /api/health"}
          </Button>
        </div>

        {result && (
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">
              Résultat: {result.success ? "✅ Succès" : "❌ Erreur"}
            </h3>
            <div className="text-sm space-y-2">
              <p><strong>Status:</strong> {result.status}</p>
              {result.data && (
                <div>
                  <p><strong>Data:</strong></p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              {result.error && (
                <div>
                  <p><strong>Error:</strong></p>
                  <pre className="bg-red-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.error, null, 2)}
                  </pre>
                </div>
              )}
              {result.headers && (
                <div>
                  <p><strong>Headers:</strong></p>
                  <pre className="bg-blue-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.headers, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="border border-red-300 rounded p-4 bg-red-50">
            <h3 className="font-semibold text-red-800 mb-2">Erreur</h3>
            <pre className="text-sm text-red-700 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
