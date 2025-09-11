// Données factices pour la plateforme GESFARM

export const fakeDashboardKPIs = {
  total_poultry: 2847,
  total_cattle: 156,
  total_crops: 23,
  total_zones: 8,
  stock_alerts_count: 5,
  low_stock_items: 3,
  recent_activities: [
    {
      id: 1,
      type: "poultry_record",
      description: "Enregistrement ponte - Lot FLOCK-001: 450 œufs",
      created_at: "2024-01-20T08:30:00Z"
    },
    {
      id: 2,
      type: "stock_movement",
      description: "Sortie stock - Aliments volailles: 50kg",
      created_at: "2024-01-20T07:15:00Z"
    },
    {
      id: 3,
      type: "cattle_record",
      description: "Production laitière - BOV-001: 25.5L",
      created_at: "2024-01-20T06:45:00Z"
    },
    {
      id: 4,
      type: "crop_activity",
      description: "Fertilisation - Parcelle Maïs Nord",
      created_at: "2024-01-19T16:20:00Z"
    }
  ],
  production_summary: {
    eggs_today: 1247,
    milk_today: 342.5,
    mortality_rate: 2.1,
    feed_consumption: 125.8
  },
  financial_summary: {
    monthly_revenue: 1250000,
    monthly_expenses: 850000,
    profit_margin: 32.0
  }
}

export const fakeStockItems = [
  {
    id: 1,
    name: "Aliment pour poules pondeuses",
    description: "Granulés 16% protéines",
    sku: "ALIM-POULE-001",
    category_id: 1,
    category: { id: 1, name: "Aliments", description: "Aliments pour animaux" },
    unit: "kg",
    current_quantity: 45,
    minimum_quantity: 100,
    unit_cost: 450,
    supplier: "Fournisseur ABC",
    expiry_date: "2024-03-15",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 2,
    name: "Vaccin Newcastle",
    description: "Vaccin préventif contre la maladie de Newcastle",
    sku: "VACC-NEW-001",
    category_id: 2,
    category: { id: 2, name: "Vétérinaire", description: "Produits vétérinaires" },
    unit: "doses",
    current_quantity: 8,
    minimum_quantity: 20,
    unit_cost: 2500,
    supplier: "Laboratoire VET",
    expiry_date: "2024-06-30",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 3,
    name: "Engrais NPK 15-15-15",
    description: "Engrais complet pour cultures",
    sku: "ENG-NPK-001",
    category_id: 3,
    category: { id: 3, name: "Intrants", description: "Intrants agricoles" },
    unit: "kg",
    current_quantity: 250,
    minimum_quantity: 50,
    unit_cost: 850,
    supplier: "Agro Supply",
    expiry_date: "2025-12-31",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 4,
    name: "Aliment pour bovins",
    description: "Concentré énergétique 18%",
    sku: "ALIM-BOV-001",
    category_id: 1,
    category: { id: 1, name: "Aliments", description: "Aliments pour animaux" },
    unit: "kg",
    current_quantity: 120,
    minimum_quantity: 80,
    unit_cost: 380,
    supplier: "Fournisseur ABC",
    expiry_date: "2024-04-20",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 5,
    name: "Semences de maïs Pioneer",
    description: "Variété Pioneer 3394",
    sku: "SEM-MAIS-001",
    category_id: 4,
    category: { id: 4, name: "Semences", description: "Semences et plants" },
    unit: "kg",
    current_quantity: 15,
    minimum_quantity: 25,
    unit_cost: 1200,
    supplier: "Semences Pro",
    expiry_date: "2024-12-31",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  }
]

export const fakePoultryFlocks = [
  {
    id: 1,
    flock_number: "FLOCK-001",
    type: "layer",
    breed: "Rhode Island Red",
    initial_quantity: 500,
    current_quantity: 485,
    arrival_date: "2024-01-15",
    zone_id: 1,
    zone: { id: 1, name: "Poulailler Nord", description: "Poulailler principal" },
    notes: "Lot de pondeuses - Production stable",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 2,
    flock_number: "FLOCK-002",
    type: "broiler",
    breed: "Cobb 500",
    initial_quantity: 300,
    current_quantity: 295,
    arrival_date: "2024-01-10",
    zone_id: 2,
    zone: { id: 2, name: "Poulailler Sud", description: "Poulailler chair" },
    notes: "Lot de chair - Croissance normale",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 3,
    flock_number: "FLOCK-003",
    type: "duck",
    breed: "Pékin",
    initial_quantity: 150,
    current_quantity: 148,
    arrival_date: "2024-01-05",
    zone_id: 3,
    zone: { id: 3, name: "Bassin Canards", description: "Zone canards" },
    notes: "Canards Pékin - Bon état",
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  }
]

export const fakeCattle = [
  {
    id: 1,
    tag_number: "BOV-001",
    name: "Belle",
    breed: "Holstein",
    gender: "female",
    birth_date: "2020-03-15",
    current_weight: 650,
    zone_id: 4,
    zone: { id: 4, name: "Pâturage Nord", description: "Pâturage principal" },
    mother_id: null,
    father_id: null,
    notes: "Vache laitière productive",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 2,
    tag_number: "BOV-002",
    name: "Bruno",
    breed: "Charolais",
    gender: "male",
    birth_date: "2019-08-20",
    current_weight: 850,
    zone_id: 5,
    zone: { id: 5, name: "Pâturage Sud", description: "Pâturage mâles" },
    mother_id: null,
    father_id: null,
    notes: "Taureau reproducteur",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  }
]

export const fakeCrops = [
  {
    id: 1,
    name: "Maïs",
    variety: "Pioneer 3394",
    zone_id: 6,
    zone: { id: 6, name: "Parcelle Nord", description: "Parcelle principale" },
    planting_date: "2024-03-01",
    expected_harvest_date: "2024-08-15",
    actual_harvest_date: null,
    planted_area: 5000,
    expected_yield: 15000,
    actual_yield: null,
    status: "growing",
    notes: "Semis réussi, croissance normale",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 2,
    name: "Tomates",
    variety: "Roma",
    zone_id: 7,
    zone: { id: 7, name: "Serre 1", description: "Serre maraîchage" },
    planting_date: "2024-01-10",
    expected_harvest_date: "2024-04-15",
    actual_harvest_date: null,
    planted_area: 200,
    expected_yield: 800,
    actual_yield: null,
    status: "growing",
    notes: "Plants en bonne santé",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z"
  }
]

export const fakeZones = [
  {
    id: 1,
    name: "Poulailler Nord",
    description: "Poulailler principal pour pondeuses",
    type: "building",
    coordinates: {
      type: "Polygon",
      coordinates: [[[2.3522, 48.8566], [2.3522, 48.8576], [2.3532, 48.8576], [2.3532, 48.8566], [2.3522, 48.8566]]]
    },
    area: 200
  },
  {
    id: 2,
    name: "Poulailler Sud",
    description: "Poulailler pour volailles de chair",
    type: "building",
    coordinates: {
      type: "Polygon",
      coordinates: [[[2.3522, 48.8566], [2.3522, 48.8576], [2.3532, 48.8576], [2.3532, 48.8566], [2.3522, 48.8566]]]
    },
    area: 150
  }
]

export const fakeStockAlerts = [
  {
    id: 1,
    stock_item_id: 1,
    stock_item: {
      id: 1,
      name: "Aliment pour poules pondeuses",
      current_quantity: 45,
      minimum_quantity: 100,
      unit: "kg"
    },
    alert_type: "low_stock",
    message: "Stock d'aliments pour poules en dessous du seuil minimum",
    priority: "high",
    created_at: "2024-01-20T00:00:00Z"
  },
  {
    id: 2,
    stock_item_id: 2,
    stock_item: {
      id: 2,
      name: "Vaccin Newcastle",
      current_quantity: 8,
      minimum_quantity: 20,
      unit: "doses"
    },
    alert_type: "low_stock",
    message: "Stock de vaccin Newcastle insuffisant",
    priority: "urgent",
    created_at: "2024-01-20T00:00:00Z"
  }
]

export const fakeNotifications = [
  {
    id: 1,
    type: "stock_alert",
    title: "Stock bas - Aliments volailles",
    message: "Le stock d'aliments pour volailles est en dessous du seuil minimum",
    priority: "high",
    is_read: false,
    related_entity_type: "StockItem",
    related_entity_id: 1,
    created_at: "2024-01-20T08:00:00Z"
  },
  {
    id: 2,
    type: "vaccination_reminder",
    title: "Rappel vaccination",
    message: "Vaccination Newcastle prévue pour le lot FLOCK-001",
    priority: "medium",
    is_read: false,
    related_entity_type: "PoultryFlock",
    related_entity_id: 1,
    created_at: "2024-01-20T07:30:00Z"
  }
]
