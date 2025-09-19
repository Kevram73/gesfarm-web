"use client"

import { useState, useEffect } from "react"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
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

export default function DashboardClient() {
  const [mounted, setMounted] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [alertsData, setAlertsData] = useState<any[]>([])
  const [financialData, setFinancialData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Charger les données seulement côté client
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Données par défaut pour éviter les boucles
        const defaultDashboardData = {
          total_poultry: 0,
          total_cattle: 0,
          total_crops: 0,
          total_zones: 0,
          production_summary: {
            eggs_today: 0,
            milk_today: 0
          }
        }
        
        const defaultFinancialData = {
          monthly_income: 0,
          monthly_expenses: 0,
          monthly_profit: 0
        }
        
        setDashboardData(defaultDashboardData)
        setAlertsData([])
        setFinancialData(defaultFinancialData)
        setIsLoading(false)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Ne pas rendre le contenu jusqu'à ce que le composant soit monté côté client
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <LayoutSimple>
      <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-xl text-white shadow-lg">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard Ferme</h1>
              <p className="mt-2 opacity-90">
                Vue d'ensemble de votre exploitation agropastorale.
              </p>
            </div>
          </div>

          {/* Main Content - Always show since we have default data */}
          {dashboardData && (
            <>
              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Volailles</p>
                <p className="text-2xl font-bold">
                  {dashboardData.total_poultry?.toLocaleString() || "0"}
                </p>
                <p className="text-xs opacity-75">Total des volailles en élevage</p>
              </div>
              <Egg className="h-8 w-8 opacity-80" />
            </div>
          </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Bovins</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.total_cattle?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs opacity-75">Troupeau bovin total</p>
                </div>
                <Milk className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Cultures</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.total_crops?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs opacity-75">Parcelles en culture</p>
                </div>
                <Wheat className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Zones</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.total_zones?.toLocaleString() || "0"}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {dashboardData.production_summary?.eggs_today?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs opacity-75">Production d'œufs du jour</p>
                </div>
                <Egg className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Lait produit</p>
                  <p className="text-2xl font-bold">
                    {dashboardData.production_summary?.milk_today || 0} L
                  </p>
                  <p className="text-xs opacity-75">Production laitière du jour</p>
                </div>
                <Milk className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className={`p-4 rounded-lg text-white ${
              (alertsData?.length || 0) > 0 
                ? "bg-gradient-to-r from-red-400 to-red-500" 
                : "bg-gradient-to-r from-green-400 to-green-500"
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Alertes Stock</p>
                  <p className="text-2xl font-bold">{alertsData?.length?.toString() || "0"}</p>
                  <p className="text-xs opacity-75">Articles en rupture ou expirés</p>
                </div>
                <AlertTriangle className="h-8 w-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Section résumé simplifiée */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Résumé de l'exploitation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Production du jour</h3>
                <p className="text-gray-600">
                  Œufs collectés : <span className="font-medium">{dashboardData.production_summary?.eggs_today?.toLocaleString() || "0"}</span>
                </p>
                <p className="text-gray-600">
                  Lait produit : <span className="font-medium">{dashboardData.production_summary?.milk_today || 0} L</span>
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-medium text-gray-900 mb-2">État des stocks</h3>
                <p className="text-gray-600">
                  Alertes actives : <span className="font-medium text-red-600">{alertsData?.length || 0}</span>
                </p>
                <p className="text-gray-600">
                  Articles en stock : <span className="font-medium">0</span>
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Situation financière</h3>
                <p className="text-gray-600">
                  Revenus mensuels : <span className="font-medium text-green-600">
                    {financialData?.monthly_income ? `${financialData.monthly_income.toLocaleString()} FCFA` : "0 FCFA"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Dépenses mensuelles : <span className="font-medium text-red-600">
                    {financialData?.monthly_expenses ? `${financialData.monthly_expenses.toLocaleString()} FCFA` : "0 FCFA"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Bénéfice : <span className={`font-medium ${
                    (financialData?.monthly_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {financialData?.monthly_profit ? `${financialData.monthly_profit.toLocaleString()} FCFA` : "0 FCFA"}
                  </span>
                </p>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </LayoutSimple>
  )
}
