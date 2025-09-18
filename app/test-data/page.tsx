"use client"

import { Layout } from "@/lib/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { useCattle, useStockItems, usePoultryFlocks, useCrops, useZones } from "@/lib/hooks/use-api-data"

export default function TestDataPage() {
  const { data: cattleData, isLoading: cattleLoading } = useCattle({ per_page: 5 })
  const { data: stockData, isLoading: stockLoading } = useStockItems({ per_page: 5 })
  const { data: poultryData, isLoading: poultryLoading } = usePoultryFlocks({ per_page: 5 })
  const { data: cropsData, isLoading: cropsLoading } = useCrops({ per_page: 5 })
  const { data: zonesData, isLoading: zonesLoading } = useZones({ per_page: 5 })

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Test des Données API</h1>
          <p className="text-gray-600 mt-2">
            Vérification que les données s'affichent correctement
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Cattle */}
          <Card>
            <CardHeader>
              <CardTitle>Bovins ({cattleLoading ? "..." : cattleData?.data?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {cattleLoading ? (
                <div className="text-sm text-gray-500">Chargement...</div>
              ) : (
                <div className="space-y-2">
                  {cattleData?.data?.slice(0, 3).map((cattle: any) => (
                    <div key={cattle.id} className="text-sm">
                      <div className="font-medium">{cattle.name}</div>
                      <div className="text-gray-500">{cattle.tag_number} - {cattle.breed}</div>
                    </div>
                  ))}
                  {cattleData?.data?.length === 0 && (
                    <div className="text-sm text-gray-500">Aucun bovin trouvé</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Items */}
          <Card>
            <CardHeader>
              <CardTitle>Stock ({stockLoading ? "..." : stockData?.data?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {stockLoading ? (
                <div className="text-sm text-gray-500">Chargement...</div>
              ) : (
                <div className="space-y-2">
                  {stockData?.data?.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="text-sm">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-500">Stock: {item.current_stock} {item.unit}</div>
                    </div>
                  ))}
                  {stockData?.data?.length === 0 && (
                    <div className="text-sm text-gray-500">Aucun article trouvé</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Poultry */}
          <Card>
            <CardHeader>
              <CardTitle>Volailles ({poultryLoading ? "..." : poultryData?.data?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {poultryLoading ? (
                <div className="text-sm text-gray-500">Chargement...</div>
              ) : (
                <div className="space-y-2">
                  {poultryData?.data?.slice(0, 3).map((flock: any) => (
                    <div key={flock.id} className="text-sm">
                      <div className="font-medium">{flock.flock_number}</div>
                      <div className="text-gray-500">{flock.breed} - {flock.current_count} têtes</div>
                    </div>
                  ))}
                  {poultryData?.data?.length === 0 && (
                    <div className="text-sm text-gray-500">Aucun lot trouvé</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Crops */}
          <Card>
            <CardHeader>
              <CardTitle>Cultures ({cropsLoading ? "..." : cropsData?.data?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {cropsLoading ? (
                <div className="text-sm text-gray-500">Chargement...</div>
              ) : (
                <div className="space-y-2">
                  {cropsData?.data?.slice(0, 3).map((crop: any) => (
                    <div key={crop.id} className="text-sm">
                      <div className="font-medium">{crop.name}</div>
                      <div className="text-gray-500">{crop.variety} - {crop.status}</div>
                    </div>
                  ))}
                  {cropsData?.data?.length === 0 && (
                    <div className="text-sm text-gray-500">Aucune culture trouvée</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zones */}
          <Card>
            <CardHeader>
              <CardTitle>Zones ({zonesLoading ? "..." : zonesData?.data?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {zonesLoading ? (
                <div className="text-sm text-gray-500">Chargement...</div>
              ) : (
                <div className="space-y-2">
                  {zonesData?.data?.slice(0, 3).map((zone: any) => (
                    <div key={zone.id} className="text-sm">
                      <div className="font-medium">{zone.name}</div>
                      <div className="text-gray-500">{zone.type} - {zone.area}m²</div>
                    </div>
                  ))}
                  {zonesData?.data?.length === 0 && (
                    <div className="text-sm text-gray-500">Aucune zone trouvée</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Debug Info */}
          <Card>
            <CardHeader>
              <CardTitle>Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div>
                  <strong>Cattle:</strong> {JSON.stringify(cattleData?.meta || {})}
                </div>
                <div>
                  <strong>Stock:</strong> {JSON.stringify(stockData?.meta || {})}
                </div>
                <div>
                  <strong>Poultry:</strong> {JSON.stringify(poultryData?.meta || {})}
                </div>
                <div>
                  <strong>Crops:</strong> {JSON.stringify(cropsData?.meta || {})}
                </div>
                <div>
                  <strong>Zones:</strong> {JSON.stringify(zonesData?.meta || {})}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
