# GESFARM - Plateforme de Gestion Agricole

Une plateforme Next.js moderne pour la gestion d'exploitations agropastorales avec un design coloré et des fonctionnalités complètes.

## 🌾 Fonctionnalités

- **Dashboard agricole** avec métriques de production en temps réel
- **Gestion des stocks** (intrants, aliments, équipements, vétérinaires)
- **Gestion avicole** (lots, ponte, incubation, santé)
- **Gestion bovine** (troupeau, production laitière, santé)
- **Gestion des cultures** (parcelles, activités, rendements)
- **Cartographie des zones** (bâtiments, pâturages, cultures)
- **Analytics avancés** avec graphiques et tendances
- **Rapports détaillés** par module
- **Système de notifications** avec alertes intelligentes
- **Paramètres personnalisables** par utilisateur
- **Thème agricole coloré** avec gradients et couleurs vives
- **Données factices** pour démonstration

## 🛠️ Technologies

- **Next.js 15** avec App Router
- **React 19** avec hooks modernes
- **Tailwind CSS 4** avec thème agricole personnalisé
- **Radix UI** pour les composants accessibles
- **TanStack Query** pour la gestion d'état serveur
- **React Hook Form** + **Zod** pour les formulaires
- **Recharts** pour les graphiques agricoles
- **Cartes interactives** avec marqueurs personnalisés
- **Lucide React** pour les icônes agricoles
- **React Hot Toast** pour les notifications
- **TypeScript** pour la sécurité des types
- **Données factices** pour démonstration complète

## 📦 Installation

1. Clonez le repository :
```bash
git clone <votre-repo>
cd my-app
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🏗️ Structure du Projet

```
my-app/
├── app/                    # Pages Next.js
│   ├── page.tsx           # Dashboard agricole
│   ├── stocks/            # Gestion des stocks
│   ├── poultry/           # Gestion avicole
│   ├── cattle/            # Gestion bovine
│   ├── crops/             # Gestion des cultures
│   ├── zones/             # Cartographie des zones
│   ├── analytics/         # Analytics avancés
│   ├── reports/           # Rapports détaillés
│   ├── notifications/     # Système de notifications
│   ├── settings/          # Paramètres
│   └── login/             # Authentification
├── lib/
│   ├── components/        # Composants réutilisables
│   │   ├── ui/           # Composants UI de base
│   │   ├── layout/       # Layout et navigation
│   │   ├── dashboard/    # Composants du dashboard
│   │   └── maps/         # Composants cartographiques
│   ├── hooks/            # Hooks personnalisés
│   │   ├── use-fake-data.ts  # Hooks avec données factices
│   │   └── use-*.ts      # Hooks par module
│   ├── services/         # Services API (prêts pour Laravel)
│   ├── data/             # Données factices
│   │   └── fake-data.ts  # Données de démonstration
│   ├── schemas/          # Schémas de validation
│   └── utils.ts          # Utilitaires
└── public/               # Assets statiques
```

## 🎨 Thème Agricole

La plateforme utilise un thème agricole coloré avec :

- **Couleurs principales** : Vert agricole (#059669)
- **Gradients** : Orange (volailles), Bleu (bovins), Vert (cultures), Violet (stocks)
- **Design moderne** avec cartes colorées et ombres douces
- **Interface intuitive** adaptée aux utilisateurs agricoles

## 📊 Modules Principaux

### 🐔 Gestion Avicole
- Suivi des lots de volailles
- Enregistrement de la ponte
- Gestion de l'incubation
- Calcul des taux de mortalité
- Statistiques de production

### 🐄 Gestion Bovine
- Suivi du troupeau
- Production laitière
- Santé des animaux
- Gestion de la généalogie
- Calcul des performances

### 🌾 Gestion des Cultures
- Suivi des parcelles
- Activités culturales
- Calcul des rendements
- Planification des récoltes
- Gestion des intrants

### 📦 Gestion des Stocks
- Inventaire des articles
- Alertes de stock bas
- Mouvements d'entrée/sortie
- Gestion des fournisseurs
- Dates d'expiration

### 🗺️ Cartographie
- Visualisation des zones
- Marqueurs interactifs
- Statistiques par zone
- Gestion spatiale

## 📈 Analytics & Rapports

- **Métriques en temps réel** de production
- **Graphiques interactifs** avec Recharts
- **Rapports détaillés** par module
- **Analyses de performance**
- **Prédictions de rendement**

## 🔔 Système de Notifications

- **Alertes de stock** bas et expirés
- **Rappels de vaccination**
- **Notifications système**
- **Priorités configurables**
- **Historique complet**

## 🎯 Données Factices

La plateforme inclut des données factices complètes pour démonstration :

- **2,847 volailles** réparties en 3 lots
- **156 bovins** avec production laitière
- **23 cultures** sur 5,200 m²
- **8 zones** cartographiées
- **45 articles de stock** avec alertes
- **Notifications** en temps réel

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting ESLint
```

## 🌐 Intégration API

La plateforme est prête pour l'intégration avec l'API Laravel GESFARM :

- **Services API** configurés dans `lib/services/`
- **Hooks** prêts pour les vraies données
- **Authentification** avec tokens Bearer
- **Gestion d'erreurs** complète

## 🎨 Personnalisation

- **Thème coloré** facilement modifiable
- **Composants réutilisables** avec Radix UI
- **Responsive design** pour tous les écrans
- **Accessibilité** intégrée

## 🚀 Prochaines Étapes

- [ ] Intégration avec l'API Laravel GESFARM
- [ ] Authentification utilisateur complète
- [ ] Tests unitaires et d'intégration
- [ ] Déploiement en production
- [ ] Mode hors-ligne (PWA)
- [ ] Notifications push
- [ ] Export de données (PDF, Excel)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

**GESFARM** - Solution complète de gestion d'exploitation agropastorale 🌾