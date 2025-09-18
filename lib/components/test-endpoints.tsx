"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import api from "@/lib/services/api"

export function TestEndpoints() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<string | null>(null)

  const testEndpoint = async (name: string, endpoint: string) => {
    setLoading(name)
    try {
      const response = await api.get(endpoint)
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          data: response.data,
          status: response.status
        }
      }))
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          error: error.response?.data || error.message,
          status: error.response?.status
        }
      }))
    }
    setLoading(null)
  }

  const endpoints = [
    { name: "Dashboard", endpoint: "/dashboard" },
    { name: "Stock Alerts", endpoint: "/dashboard/stock-alerts" },
    { name: "Stock Items", endpoint: "/stock/items" },
    { name: "Poultry Flocks", endpoint: "/poultry/flocks" },
    { name: "Cattle", endpoint: "/cattle" },
    { name: "Crops", endpoint: "/crops" },
    { name: "Zones", endpoint: "/zones" },
    { name: "Profile", endpoint: "/profile" }
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Test des Endpoints API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {endpoints.map((endpoint) => (
            <Button
              key={endpoint.name}
              onClick={() => testEndpoint(endpoint.name, endpoint.endpoint)}
              disabled={loading === endpoint.name}
              variant="outline"
              className="justify-start"
            >
              {loading === endpoint.name ? "Test..." : `Test ${endpoint.name}`}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="border rounded p-4">
              <h3 className="font-semibold mb-2">{name}</h3>
              <div className="text-sm">
                <p>Status: {result.status}</p>
                <p>Success: {result.success ? "✅" : "❌"}</p>
                {result.success ? (
                  <div>
                    <p>Data:</p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div>
                    <p>Error:</p>
                    <pre className="bg-red-100 p-2 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(result.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
