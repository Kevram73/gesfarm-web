"use client"

import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Chart } from "@/lib/components/dashboard"
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Target,
  DollarSign,
  Calendar,
  Milk
} from "lucide-react"

export default function AnalyticsPage() {
  // Données factices pour les analytics
  const analyticsData = {
    poultry: {
      total_flocks: 3,
      total_birds: 928,
      eggs_per_day: 1247,
      mortality_rate: 2.1,
      feed_efficiency: 1.8,
      production_trend: [
        { month: "Jan", eggs: 1200, mortality: 15 },
        { month: "Fév", eggs: 1250, mortality: 12 },
        { month: "Mar", eggs: 1300, mortality: 18 },
        { month: "Avr", eggs: 1247, mortality: 20 }
      ]
    },
    cattle: {
      total_animals: 156,
      milk_production: 342.5,
      average_weight: 650,
      health_score: 95,
      production_trend: [
        { month: "Jan", milk: 320, weight: 645 },
        { month: "Fév", milk: 335, weight: 648 },
        { month: "Mar", milk: 340, weight: 650 },
        { month: "Avr", milk: 342.5, weight: 652 }
      ]
    },
    crops: {
      total_parcels: 23,
      total_area: 5200,
      expected_yield: 15800,
      actual_yield: 14200,
      yield_trend: [
        { month: "Jan", expected: 0, actual: 0 },
        { month: "Fév", expected: 0, actual: 0 },
        { month: "Mar", expected: 2000, actual: 1800 },
        { month: "Avr", expected: 4000, actual: 3800 }
      ]
    },
    financial: {
      monthly_revenue: 1250000,
      monthly_expenses: 850000,
      profit_margin: 32.0,
      roi: 15.2,
      cost_breakdown: [
        { category: "Aliments", amount: 450000, percentage: 53 },
        { category: "Médicaments", amount: 120000, percentage: 14 },
        { category: "Maintenance", amount: 80000, percentage: 9 },
        { category: "Personnel", amount: 200000, percentage: 24 }
      ]
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white">
            <h1 className="text-3xl font-bold tracking-tight">Analytics Avancés</h1>
            <p className="mt-2 opacity-90">
              Analyses détaillées et tendances de votre exploitation.
            </p>
          </div>
        </div>

        {/* KPIs Principaux */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gradient-to-r from-green-400 to-green-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Revenus Mensuels</p>
                <p className="text-2xl font-bold">{analyticsData.financial.monthly_revenue.toLocaleString()} FCFA</p>
                <p className="text-xs opacity-75">+12.5% vs mois dernier</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Marge Bénéficiaire</p>
                <p className="text-2xl font-bold">{analyticsData.financial.profit_margin}%</p>
                <p className="text-xs opacity-75">ROI: {analyticsData.financial.roi}%</p>
              </div>
              <Target className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Production Œufs</p>
                <p className="text-2xl font-bold">{analyticsData.poultry.eggs_per_day.toLocaleString()}/jour</p>
                <p className="text-xs opacity-75">Efficacité: {analyticsData.poultry.feed_efficiency}</p>
              </div>
              <Activity className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Production Lait</p>
                <p className="text-2xl font-bold">{analyticsData.cattle.milk_production} L/jour</p>
                <p className="text-xs opacity-75">Score santé: {analyticsData.cattle.health_score}%</p>
              </div>
              <BarChart3 className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Graphiques de Production */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                Production Avicole
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                title=""
                description=""
                type="line"
                dataKey="eggs"
                data={analyticsData.poultry.production_trend}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Milk className="mr-2 h-5 w-5 text-blue-500" />
                Production Laitière
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                title=""
                description=""
                type="area"
                dataKey="milk"
                data={analyticsData.cattle.production_trend}
              />
            </CardContent>
          </Card>
        </div>

        {/* Analyse des Coûts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-purple-500" />
                Répartition des Coûts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.financial.cost_breakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: [
                            "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"
                          ][index]
                        }}
                      ></div>
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{item.amount.toLocaleString()} FCFA</p>
                      <p className="text-xs text-gray-500">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-green-500" />
                Rendement des Cultures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                title=""
                description=""
                type="bar"
                dataKey="actual"
                data={analyticsData.crops.yield_trend}
              />
            </CardContent>
          </Card>
        </div>

        {/* Métriques Détaillées */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Avicole</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taux de mortalité:</span>
                  <span className="font-medium">{analyticsData.poultry.mortality_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Efficacité alimentaire:</span>
                  <span className="font-medium">{analyticsData.poultry.feed_efficiency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total volailles:</span>
                  <span className="font-medium">{analyticsData.poultry.total_birds}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Bovine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Poids moyen:</span>
                  <span className="font-medium">{analyticsData.cattle.average_weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Score santé:</span>
                  <span className="font-medium text-green-600">{analyticsData.cattle.health_score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total animaux:</span>
                  <span className="font-medium">{analyticsData.cattle.total_animals}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Cultures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rendement réel:</span>
                  <span className="font-medium">{analyticsData.crops.actual_yield.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rendement attendu:</span>
                  <span className="font-medium">{analyticsData.crops.expected_yield.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Surface totale:</span>
                  <span className="font-medium">{analyticsData.crops.total_area} m²</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}