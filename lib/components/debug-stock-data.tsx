"use client"

import { useStockItems } from "@/lib/hooks/use-api-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"

export function DebugStockData() {
  const { data: stockData, isLoading, error } = useStockItems({ per_page: 20 })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Debug Données Stock - Chargement...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement des données...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Debug Données Stock - Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-red-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  }

  const stockItems = stockData?.data || []

  // Calcul des statistiques
  const totalItems = stockItems.length
  const lowStockItems = stockItems.filter(item => 
    parseFloat(item.current_quantity) <= parseFloat(item.minimum_quantity)
  ).length
  
  const totalValue = stockItems.reduce((sum, item) => {
    const quantity = parseFloat(item.current_quantity) || 0
    const cost = parseFloat(item.unit_cost) || 0
    return sum + (quantity * cost)
  }, 0)

  const categories = [...new Set(stockItems.map(item => item.category?.name))]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug Données Stock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Résumé :</h3>
          <ul className="text-sm space-y-1">
            <li>Nombre d'articles : {totalItems}</li>
            <li>Articles en stock faible : {lowStockItems}</li>
            <li>Valeur totale du stock : {totalValue.toLocaleString()} FCFA</li>
            <li>Catégories : {categories.length}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Détails des articles :</h3>
          <div className="space-y-2 max-h-60 overflow-auto">
            {stockItems.map((item: any) => (
              <div key={item.id} className="border rounded p-2 text-xs">
                <div className="font-medium">{item.name} ({item.sku})</div>
                <div className="text-gray-600">
                  Catégorie: {item.category?.name} | Quantité: {item.current_quantity} {item.unit}
                </div>
                <div className="text-gray-600">
                  Coût unitaire: {item.unit_cost} FCFA | Stock min: {item.minimum_quantity}
                </div>
                <div className="text-gray-600">
                  Fournisseur: {item.supplier} | Expiration: {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                </div>
                {parseFloat(item.current_quantity) <= parseFloat(item.minimum_quantity) && (
                  <div className="text-red-600 font-medium">⚠️ Stock faible</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Données brutes :</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(stockData, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
