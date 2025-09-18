"use client"

import { useCattle } from "@/lib/hooks/use-api-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"

export function DebugCattleData() {
  const { data: cattleData, isLoading, error } = useCattle({ per_page: 20 })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Debug Données Bovins - Chargement...</CardTitle>
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
          <CardTitle>Debug Données Bovins - Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-red-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  }

  const cattle = cattleData?.data || []

  // Calcul du poids moyen
  const totalWeight = cattle.reduce((sum, animal) => {
    const weight = parseFloat(animal.current_weight) || 0
    return sum + weight
  }, 0)
  
  const averageWeight = cattle.length > 0 ? Math.round(totalWeight / cattle.length) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug Données Bovins</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Résumé :</h3>
          <ul className="text-sm space-y-1">
            <li>Nombre de bovins : {cattle.length}</li>
            <li>Poids total : {totalWeight} kg</li>
            <li>Poids moyen : {averageWeight} kg</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Détails des bovins :</h3>
          <div className="space-y-2 max-h-60 overflow-auto">
            {cattle.map((animal: any) => (
              <div key={animal.id} className="border rounded p-2 text-xs">
                <div className="font-medium">{animal.name} ({animal.tag_number})</div>
                <div className="text-gray-600">
                  Poids: {animal.current_weight} (type: {typeof animal.current_weight})
                </div>
                <div className="text-gray-600">
                  Poids parsé: {parseFloat(animal.current_weight) || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Données brutes :</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(cattleData, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
