"use client"

import { Layout } from "@/lib/components/layout"
import { MetricCard, Chart, RecentActivity } from "@/lib/components/dashboard"
import { useDashboardKPIs, useStockAlerts } from "@/lib/hooks/use-fake-data"
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Egg,
  Milk,
  Wheat,
  AlertTriangle,
  MapPin,
  Package
} from "lucide-react"

export default function Home() {
  const { data: kpis, isLoading: kpisLoading } = useDashboardKPIs()
  const { data: stockAlerts } = useStockAlerts()

  if (kpisLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Ferme</h1>
            <p className="text-gray-300 mt-2">
              Chargement des métriques de votre exploitation...
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="gradient-dashboard p-6 rounded-lg text-white">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Ferme</h1>
            <p className="mt-2 opacity-90">
              Vue d'ensemble de votre exploitation agropastorale.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="gradient-poultry p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Volailles</p>
                <p className="text-2xl font-bold">{kpis?.total_poultry?.toLocaleString() || "0"}</p>
                <p className="text-xs opacity-75">Total des volailles en élevage</p>
              </div>
              <Egg className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="gradient-cattle p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Bovins</p>
                <p className="text-2xl font-bold">{kpis?.total_cattle?.toLocaleString() || "0"}</p>
                <p className="text-xs opacity-75">Troupeau bovin total</p>
              </div>
              <Milk className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="gradient-crops p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Cultures</p>
                <p className="text-2xl font-bold">{kpis?.total_crops?.toLocaleString() || "0"}</p>
                <p className="text-xs opacity-75">Parcelles en culture</p>
              </div>
              <Wheat className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="gradient-stock p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Zones</p>
                <p className="text-2xl font-bold">{kpis?.total_zones?.toLocaleString() || "0"}</p>
                <p className="text-xs opacity-75">Zones de l'exploitation</p>
              </div>
              <MapPin className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Production et Alertes */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Œufs collectés</p>
                <p className="text-2xl font-bold">{kpis?.production_summary?.eggs_today?.toLocaleString() || "0"}</p>
                <p className="text-xs opacity-75">Production d'œufs du jour</p>
              </div>
              <Egg className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Lait produit</p>
                <p className="text-2xl font-bold">{kpis?.production_summary?.milk_today || 0} L</p>
                <p className="text-xs opacity-75">Production laitière du jour</p>
              </div>
              <Milk className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className={`p-4 rounded-lg text-white ${
            stockAlerts?.length > 0 
              ? "bg-gradient-to-r from-red-400 to-red-500" 
              : "bg-gradient-to-r from-green-400 to-green-500"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Alertes Stock</p>
                <p className="text-2xl font-bold">{stockAlerts?.length?.toString() || "0"}</p>
                <p className="text-xs opacity-75">Articles en rupture ou expirés</p>
              </div>
              <AlertTriangle className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <Chart
              title="Production Avicole"
              description="Évolution de la production d'œufs sur 30 jours"
              type="area"
              dataKey="eggs"
            />
          </div>
          <div className="col-span-3">
            <RecentActivity />
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Chart
            title="Production Laitière"
            description="Production laitière par animal"
            type="bar"
            dataKey="milk"
          />
          <Chart
            title="Consommation Alimentaire"
            description="Consommation d'aliments par type"
            type="line"
            dataKey="feed"
          />
        </div>
      </div>
    </Layout>
  )
}
