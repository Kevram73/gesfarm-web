"use client"

import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Table,
  Filter,
  Search
} from "lucide-react"

export default function ReportsPage() {
  // Données factices pour les rapports
  const reports = [
    {
      id: 1,
      title: "Rapport de Production Avicole",
      type: "poultry",
      period: "Janvier 2024",
      status: "completed",
      generated_at: "2024-01-20T10:30:00Z",
      summary: {
        total_eggs: 38450,
        mortality_rate: 2.1,
        feed_consumption: 1250,
        revenue: 450000
      }
    },
    {
      id: 2,
      title: "Rapport de Production Laitière",
      type: "cattle",
      period: "Janvier 2024",
      status: "completed",
      generated_at: "2024-01-20T09:15:00Z",
      summary: {
        total_milk: 10275,
        average_per_cow: 25.5,
        health_score: 95,
        revenue: 350000
      }
    },
    {
      id: 3,
      title: "Rapport Financier Mensuel",
      type: "financial",
      period: "Janvier 2024",
      status: "completed",
      generated_at: "2024-01-20T08:45:00Z",
      summary: {
        revenue: 1250000,
        expenses: 850000,
        profit: 400000,
        margin: 32.0
      }
    },
    {
      id: 4,
      title: "Rapport de Stock",
      type: "stock",
      period: "Janvier 2024",
      status: "completed",
      generated_at: "2024-01-20T07:20:00Z",
      summary: {
        total_items: 45,
        low_stock: 5,
        expired_items: 2,
        total_value: 2500000
      }
    },
    {
      id: 5,
      title: "Rapport de Cultures",
      type: "crops",
      period: "Janvier 2024",
      status: "generating",
      generated_at: "2024-01-20T11:00:00Z",
      summary: null
    }
  ]

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "poultry": return "Avicole"
      case "cattle": return "Bovine"
      case "financial": return "Financier"
      case "stock": return "Stock"
      case "crops": return "Cultures"
      default: return type
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "poultry": return "bg-orange-500"
      case "cattle": return "bg-blue-500"
      case "financial": return "bg-green-500"
      case "stock": return "bg-purple-500"
      case "crops": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "generating": return "bg-yellow-100 text-yellow-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Terminé"
      case "generating": return "En cours"
      case "failed": return "Échec"
      default: return status
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-lg text-white">
            <h1 className="text-3xl font-bold tracking-tight">Rapports</h1>
            <p className="mt-2 opacity-90">
              Génération et consultation des rapports de votre exploitation.
            </p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600">
            <FileText className="h-6 w-6" />
            <span>Rapport Avicole</span>
          </Button>
          
          <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600">
            <BarChart3 className="h-6 w-6" />
            <span>Rapport Bovin</span>
          </Button>
          
          <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600">
            <PieChart className="h-6 w-6" />
            <span>Rapport Financier</span>
          </Button>
          
          <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600">
            <Table className="h-6 w-6" />
            <span>Rapport Stock</span>
          </Button>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Rechercher un rapport..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Période
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rapports */}
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(report.type)} text-white`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{report.title}</h3>
                      <p className="text-sm text-gray-600">
                        Période: {report.period} • 
                        Généré le {new Date(report.generated_at).toLocaleDateString("fr-FR")}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`${getTypeColor(report.type)} text-white`}>
                          {getTypeLabel(report.type)}
                        </Badge>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusLabel(report.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {report.status === "completed" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger
                        </Button>
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                      </>
                    )}
                    {report.status === "generating" && (
                      <Button variant="outline" size="sm" disabled>
                        Génération...
                      </Button>
                    )}
                  </div>
                </div>

                {/* Résumé du rapport */}
                {report.summary && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(report.summary).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 capitalize">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {typeof value === 'number' 
                            ? value.toLocaleString() + (key.includes('rate') || key.includes('score') ? '%' : '')
                            : value
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistiques des rapports */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rapports Générés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {reports.filter(r => r.status === "completed").length}
              </div>
              <p className="text-sm text-gray-600">Ce mois-ci</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">En Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {reports.filter(r => r.status === "generating").length}
              </div>
              <p className="text-sm text-gray-600">Génération en cours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Types Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">5</div>
              <p className="text-sm text-gray-600">Types de rapports</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
