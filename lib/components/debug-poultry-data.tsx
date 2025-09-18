"use client"

import { usePoultryFlocks } from "@/lib/hooks/use-api-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"

export function DebugPoultryData() {
  const { data: flocksData, isLoading, error } = usePoultryFlocks({ per_page: 20 })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Debug Données Volaille - Chargement...</CardTitle>
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
          <CardTitle>Debug Données Volaille - Erreur</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-red-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  }

  const flocks = flocksData?.data || []

  // Calcul des statistiques
  const totalBirds = flocks.reduce((sum, flock) => sum + (flock.current_quantity || 0), 0)
  const totalEggs = flocks.reduce((sum, flock) => {
    const recentRecord = flock.records?.[0]
    return sum + (recentRecord?.eggs_collected || 0)
  }, 0)
  
  const activeFlocks = flocks.filter(flock => flock.status === 'active').length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug Données Volaille</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Résumé :</h3>
          <ul className="text-sm space-y-1">
            <li>Nombre de lots : {flocks.length}</li>
            <li>Lots actifs : {activeFlocks}</li>
            <li>Total oiseaux : {totalBirds}</li>
            <li>Total œufs (dernier jour) : {totalEggs}</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Détails des lots :</h3>
          <div className="space-y-2 max-h-60 overflow-auto">
            {flocks.map((flock: any) => (
              <div key={flock.id} className="border rounded p-2 text-xs">
                <div className="font-medium">{flock.flock_number} - {flock.breed}</div>
                <div className="text-gray-600">
                  Type: {flock.type} | Quantité: {flock.current_quantity} | Statut: {flock.status}
                </div>
                <div className="text-gray-600">
                  Zone: {flock.zone?.name} | Âge: {flock.age_days} jours
                </div>
                {flock.records?.[0] && (
                  <div className="text-gray-600">
                    Dernier record: {flock.records[0].eggs_collected} œufs, {flock.records[0].feed_consumed}kg aliment
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Données brutes :</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
            {JSON.stringify(flocksData, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
