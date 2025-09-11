# Intégration React Leaflet

## Problème actuel
React Leaflet v4.2.1 n'est pas encore compatible avec React 19. Il nécessite React ^18.0.0.

## Solution temporaire
Une carte de démonstration a été créée dans `lib/components/maps/map.tsx` qui simule l'interface d'une carte interactive.

## Intégration future
Quand React Leaflet sera compatible avec React 19, suivez ces étapes :

### 1. Installer les dépendances
```bash
npm install react-leaflet leaflet
npm install --save-dev @types/leaflet
```

### 2. Ajouter les styles CSS
Dans `app/globals.css`, ajoutez :
```css
@import "leaflet/dist/leaflet.css";
```

### 3. Remplacer le composant Map
Remplacez le contenu de `lib/components/maps/map.tsx` par le code original avec React Leaflet.

### 4. Configuration des icônes
Ajoutez cette configuration pour corriger les icônes Leaflet :
```typescript
import { Icon } from "leaflet"

delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})
```

## Alternatives
- **Mapbox GL JS** : Alternative moderne avec React
- **Google Maps** : Avec @googlemaps/react-wrapper
- **OpenLayers** : Solution open source puissante
