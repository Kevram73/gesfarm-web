"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import api from "@/lib/services/api"

export function TestDeleteCattle() {
  const [cattleId, setCattleId] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDelete = async () => {
    if (!cattleId) {
      setResult({ error: "Veuillez entrer un ID de bovin" })
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      console.log(`Testing DELETE /api/cattle/${cattleId}`)
      const response = await api.delete(`/cattle/${cattleId}`)
      console.log("Delete response:", response)
      setResult({
        success: true,
        data: response.data,
        status: response.status
      })
    } catch (error: any) {
      console.error("Delete error:", error)
      setResult({
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status
      })
    }
    setLoading(false)
  }

  const testGetCattle = async () => {
    if (!cattleId) {
      setResult({ error: "Veuillez entrer un ID de bovin" })
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      console.log(`Testing GET /api/cattle/${cattleId}`)
      const response = await api.get(`/cattle/${cattleId}`)
      console.log("Get response:", response)
      setResult({
        success: true,
        data: response.data,
        status: response.status
      })
    } catch (error: any) {
      console.error("Get error:", error)
      setResult({
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status
      })
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Test Suppression Bovin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cattleId">ID du bovin à tester</Label>
          <Input
            id="cattleId"
            value={cattleId}
            onChange={(e) => setCattleId(e.target.value)}
            placeholder="Ex: 1"
            type="number"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={testGetCattle}
            disabled={loading}
            variant="outline"
          >
            {loading ? "Test..." : "Tester GET"}
          </Button>
          <Button 
            onClick={testDelete}
            disabled={loading}
            variant="destructive"
          >
            {loading ? "Test..." : "Tester DELETE"}
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
