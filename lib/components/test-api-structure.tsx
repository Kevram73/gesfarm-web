"use client"

import { useState } from "react"
import { Button } from "@/lib/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import api from "@/lib/services/api"

export function TestApiStructure() {
  const [results, setResults] = useState<any>({})

  const testEndpoint = async (name: string, endpoint: string) => {
    try {
      console.log(`Testing ${name}: ${endpoint}`)
      const response = await api.get(endpoint)
      console.log(`${name} response:`, response.data)
      setResults(prev => ({
        ...prev,
        [name]: {
          success: true,
          data: response.data,
          status: response.status
        }
      }))
    } catch (error: any) {
      console.error(`${name} error:`, error)
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          error: error.response?.data || error.message,
          status: error.response?.status
        }
      }))
    }
  }

  const testAllEndpoints = async () => {
    const endpoints = [
      { name: "Stock Items", endpoint: "/stock/items?per_page=5" },
      { name: "Poultry Flocks", endpoint: "/poultry/flocks?per_page=5" },
      { name: "Crops", endpoint: "/crops?per_page=5" },
      { name: "Zones", endpoint: "/zones?per_page=5" },
      { name: "Tasks", endpoint: "/tasks?per_page=5" },
      { name: "Users", endpoint: "/users?per_page=5" },
      { name: "Notifications", endpoint: "/notifications?per_page=5" },
      { name: "Dashboard", endpoint: "/dashboard" },
      { name: "Stock Alerts", endpoint: "/dashboard/stock-alerts" }
    ]

    for (const endpoint of endpoints) {
      await testEndpoint(endpoint.name, endpoint.endpoint)
      // Petite pause entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Test Structure des Endpoints API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testAllEndpoints} className="w-full">
          Tester Tous les Endpoints
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(results).map(([name, result]: [string, any]) => (
            <Card key={name} className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {name} {result.success ? "✅" : "❌"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-2">
                  <p><strong>Status:</strong> {result.status}</p>
                  {result.success ? (
                    <div>
                      <p><strong>Structure:</strong></p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <p><strong>Error:</strong></p>
                      <pre className="bg-red-100 p-2 rounded text-xs overflow-auto max-h-32">
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
