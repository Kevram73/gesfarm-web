"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Label } from "@/lib/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { useDashboardKPIs, useStockAlerts, usePoultryFlocks, useCattle, useCrops } from "@/lib/hooks/use-api-data"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Egg, 
  Milk, 
  Wheat,
  Download,
  Calendar,
  Filter
} from "lucide-react"

export default function ReportsPage() {
  const router = useRouter()
  const { data: kpisData } = useDashboardKPIs()
  const { data: stockAlerts } = useStockAlerts()
  const { data: poultryData } = usePoultryFlocks()
  const { data: cattleData } = useCattle()
  const { data: cropsData } = useCrops()
  
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [selectedReport, setSelectedReport] = useState("overview")

  const kpis = kpisData || {
    total_revenue: 0,
    total_expenses: 0,
    net_profit: 0,
    total_animals: 0,
    total_crops: 0,
    stock_alerts: 0
  }

  const stockItems = stockAlerts?.items || []
  const poultryFlocks = poultryData?.items || []
  const cattle = cattleData?.items || []
  const crops = cropsData?.items || []

  const reportTypes = [
    { value: "overview", label: "Vue d'ensemble" },
    { value: "financial", label: "Rapport financier" },
    { value: "production", label: "Production" },
    { value: "inventory", label: "Inventaire" },
    { value: "performance", label: "Performance" }
  ]

  const periods = [
    { value: "7", label: "7 derniers jours" },
    { value: "30", label: "30 derniers jours" },
    { value: "90", label: "3 derniers mois" },
    { value: "365", label: "12 derniers mois" }
  ]

  const generateReport = () => {
    // Ici vous devriez générer le rapport selon le type sélectionné
    console.log("Génération du rapport:", selectedReport, "pour la période:", selectedPeriod)
  }

  const exportReport = () => {
    // Ici vous devriez exporter le rapport
    console.log("Export du rapport")
  }

  return (
    <LayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Rapports & Analytics</h1>
            <p className="text-gray-300 mt-2">
              Analysez les performances de votre exploitation agricole.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={exportReport}
              variant="outline"
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button 
              onClick={generateReport}
              className="bg-green-600 hover:bg-green-700"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Générer
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Label>Période:</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Label>Type de rapport:</Label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Principaux */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(kpis.total_revenue || 0).toLocaleString()} FCFA
              </div>
              <p className="text-xs text-gray-600">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% vs période précédente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {(kpis.total_expenses || 0).toLocaleString()} FCFA
              </div>
              <p className="text-xs text-gray-600">
                <TrendingDown className="inline h-3 w-3 mr-1" />
                -5% vs période précédente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bénéfice Net</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {(kpis.net_profit || 0).toLocaleString()} FCFA
              </div>
              <p className="text-xs text-gray-600">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +18% vs période précédente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Animaux</CardTitle>
              <Milk className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {kpis.total_animals}
              </div>
              <p className="text-xs text-gray-600">
                Bovins + Volailles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques et Analyses */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Production par Type */}
          <Card>
            <CardHeader>
              <CardTitle>Production par Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Egg className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Volailles</span>
                  </div>
                  <span className="font-medium">{poultryFlocks.length} lots</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Milk className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Bovins</span>
                  </div>
                  <span className="font-medium">{cattle.length} têtes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wheat className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Cultures</span>
                  </div>
                  <span className="font-medium">{crops.length} parcelles</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alertes Stock */}
          <Card>
            <CardHeader>
              <CardTitle>Alertes Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stockItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-red-800">{item.name}</p>
                      <p className="text-xs text-red-600">
                        Stock: {item.current_stock} {item.unit}
                      </p>
                    </div>
                    <Package className="h-4 w-4 text-red-500" />
                  </div>
                ))}
                {stockItems.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucune alerte de stock
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau de Bord Détaillé */}
        <Card>
          <CardHeader>
            <CardTitle>Tableau de Bord Détaillé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Volailles */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center">
                  <Egg className="mr-2 h-5 w-5 text-yellow-500" />
                  Volailles
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total lots:</span>
                    <span className="font-medium">{poultryFlocks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total volailles:</span>
                    <span className="font-medium">
                      {poultryFlocks.reduce((sum, flock) => sum + flock.current_quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Lots actifs:</span>
                    <span className="font-medium">
                      {poultryFlocks.filter(flock => flock.status === "active").length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bovins */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center">
                  <Milk className="mr-2 h-5 w-5 text-purple-500" />
                  Bovins
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total bovins:</span>
                    <span className="font-medium">{cattle.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Femelles:</span>
                    <span className="font-medium">
                      {cattle.filter(animal => animal.gender === "female").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mâles:</span>
                    <span className="font-medium">
                      {cattle.filter(animal => animal.gender === "male").length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cultures */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center">
                  <Wheat className="mr-2 h-5 w-5 text-green-500" />
                  Cultures
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total parcelles:</span>
                    <span className="font-medium">{crops.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">En croissance:</span>
                    <span className="font-medium">
                      {crops.filter(crop => crop.status === "growing").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Récoltées:</span>
                    <span className="font-medium">
                      {crops.filter(crop => crop.status === "harvested").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommandations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Optimisation des stocks:</strong> Considérez réduire les commandes d'aliments pour volailles 
                  car le stock actuel est suffisant pour 2 mois.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Production:</strong> Les rendements de maïs sont excellents cette saison. 
                  Planifiez une récolte supplémentaire.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Maintenance:</strong> Le poulailler principal nécessite un nettoyage approfondi 
                  prévu pour la semaine prochaine.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutSimple>
  )
}