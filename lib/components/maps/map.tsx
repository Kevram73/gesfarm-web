"use client"

import { MapPin } from "lucide-react"

interface MapProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    position: [number, number]
    title: string
    description?: string
  }>
  className?: string
}

export function Map({ 
  center = [48.8566, 2.3522], // Paris par défaut
  zoom = 13,
  markers = [],
  className = "h-[400px] w-full"
}: MapProps) {
  return (
    <div className={className}>
      <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
        {/* Carte de démonstration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Marqueurs simulés */}
        {markers.map((marker, index) => {
          const x = 20 + (index * 15) % 60
          const y = 20 + (index * 25) % 60
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="bg-red-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-red-600 transition-colors">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                {marker.title}
              </div>
            </div>
          )
        })}
        
        {/* Message d'information */}
        <div className="text-center z-10">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-muted-foreground">Carte Interactive</h3>
          <p className="text-sm text-muted-foreground">
            {markers.length} marqueur{markers.length > 1 ? 's' : ''} affiché{markers.length > 1 ? 's' : ''}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            React Leaflet sera intégré après résolution des dépendances
          </p>
        </div>
      </div>
    </div>
  )
}
