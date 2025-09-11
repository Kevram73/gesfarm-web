# Guide de Résolution des Problèmes

## Problèmes Résolus

### 1. Conflit de Dépendances React Leaflet
**Problème** : React Leaflet v4.2.1 n'est pas compatible avec React 19
```
npm error ERESOLVE unable to resolve dependency tree
npm error peer react@"^18.0.0" from react-leaflet@4.2.1
```

**Solution** :
- Supprimé temporairement React Leaflet du package.json
- Créé une carte de démonstration dans `lib/components/maps/map.tsx`
- Documenté l'intégration future dans `LEAFLET_INTEGRATION.md`

### 2. Politique d'Exécution PowerShell
**Problème** : npm ne peut pas s'exécuter à cause des politiques de sécurité
```
npm : Impossible de charger le fichier C:\Program Files\nodejs\npm.ps1
```

**Solution** :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 3. Erreur de Syntaxe JSON
**Problème** : Virgule en trop dans package.json
```
npm error JSON.parse Expected double-quoted property name in JSON
```

**Solution** : Supprimé la virgule en trop à la ligne 41 du package.json

## Solutions Alternatives

### Pour les Cartes
Si vous voulez des cartes fonctionnelles immédiatement :

1. **Mapbox GL JS** :
```bash
npm install mapbox-gl @mapbox/mapbox-gl-geocoder
```

2. **Google Maps** :
```bash
npm install @googlemaps/react-wrapper
```

3. **OpenLayers** :
```bash
npm install ol react-openlayers
```

### Pour l'Installation
Si npm continue à poser problème :

1. **Utiliser cmd au lieu de PowerShell** :
```bash
cmd /c "npm install"
```

2. **Utiliser yarn** :
```bash
yarn install
```

3. **Utiliser pnpm** :
```bash
pnpm install
```

## Commandes Utiles

### Nettoyer le Cache
```bash
npm cache clean --force
```

### Réinstaller node_modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Vérifier les Versions
```bash
npm list react react-dom
node --version
npm --version
```

## Support

Si vous rencontrez d'autres problèmes :
1. Vérifiez la console du navigateur
2. Consultez les logs npm
3. Vérifiez la compatibilité des versions
4. Consultez la documentation officielle des packages
