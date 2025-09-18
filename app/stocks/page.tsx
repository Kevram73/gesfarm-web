"use client"

import { AuthGuard } from "@/lib/components/auth/auth-guard"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { useStockItems, useStockAlerts } from "@/lib/hooks/use-api-data"
import { useRouter } from "next/navigation"
import { Package, AlertTriangle, Plus, Search, Filter } from "lucide-react"

export default function StocksPage() {
  const router = useRouter()
  const { data: stockData, isLoading } = useStockItems({ per_page: 20 })
  const { data: stockAlerts } = useStockAlerts()

  if (isLoading) {
    return (
      <AuthGuard>
        <LayoutSimple>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Gestion des Stocks</h1>
              <p className="text-gray-300 mt-2">
                Chargement des articles de stock...
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </LayoutSimple>
      </AuthGuard>
    )
  }

  const stockItems = stockData?.data || []

  return (
    <AuthGuard>
      <LayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Gestion des Stocks</h1>
            <p className="text-gray-300 mt-2">
              Suivi des intrants, aliments et équipements de votre exploitation.
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/stocks/create'}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un article
          </Button>
        </div>

        {/* Alertes de stock */}
        {stockAlerts && stockAlerts.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Alertes de Stock ({stockAlerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stockAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div>
                      <p className="font-medium">{alert.item_name}</p>
                      <p className="text-sm text-gray-600">
                        Stock actuel: {alert.current_stock} unités
                      </p>
                    </div>
                    <Badge variant="destructive">
                      {alert.alert_type === "low_stock" ? "Stock bas" : 
                       alert.alert_type === "expired" ? "Expiré" : "Proche expiration"}
                    </Badge>
                  </div>
                ))}
                {stockAlerts.length > 3 && (
                  <p className="text-sm text-gray-600">
                    +{stockAlerts.length - 3} autres alertes...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recherche et filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un article..."
                  className="pl-9"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des articles */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stockItems.map((item) => {
            const isLowStock = parseFloat((item as any).current_quantity) <= parseFloat((item as any).minimum_quantity)
            const isExpired = item.expiry_date && new Date(item.expiry_date) < new Date()
            
            return (
              <Card key={item.id} className={`hover:shadow-md transition-shadow ${
                isLowStock || isExpired ? "border-red-200" : ""
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-gray-500" />
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                    </div>
                    {isLowStock && (
                      <Badge variant="destructive" className="text-xs">
                        Stock bas
                      </Badge>
                    )}
                    {isExpired && (
                      <Badge variant="destructive" className="text-xs">
                        Expiré
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.sku}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stock actuel:</span>
                      <span className={`font-medium ${
                        isLowStock ? "text-red-600" : "text-gray-900"
                      }`}>
                        {(item as any).current_quantity} {item.unit}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stock minimum:</span>
                      <span className="text-gray-900">{(item as any).minimum_quantity} {item.unit}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fournisseur:</span>
                      <span className="text-gray-900">{(item as any).supplier || 'N/A'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Prix unitaire:</span>
                      <span className="text-gray-900">{(parseFloat((item as any).unit_cost) || 0).toLocaleString()} FCFA</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Catégorie:</span>
                      <span className="text-gray-900 text-sm">{(item as any).category?.name || 'N/A'}</span>
                    </div>
                    
                    {item.location && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Emplacement:</span>
                        <span className="text-gray-900 text-sm">{item.location}</span>
                      </div>
                    )}
                    
                    {item.expiry_date && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Date d'expiration:</span>
                        <span className={`text-sm ${
                          isExpired ? "text-red-600" : "text-gray-900"
                        }`}>
                          {new Date(item.expiry_date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                    )}
                    
                    <div className="pt-2 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/stocks/edit/${item.id}`)}
                      >
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Mouvement
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Pagination */}
        {(stockData as any)?.pagination && (stockData as any).pagination.last_page > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Précédent
              </Button>
              <Button variant="outline" size="sm">
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
      </LayoutSimple>
    </AuthGuard>
  )
}
