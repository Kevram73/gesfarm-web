import api from "./api"

export interface PoultryProductionReport {
  period: string
  total_flocks: number
  total_birds: number
  total_eggs_collected: number
  average_egg_production_per_bird: number
  total_feed_consumed: number
  mortality_count: number
  mortality_rate: number
  production_by_flock: Array<{
    flock_id: number
    flock_number: string
    eggs_collected: number
    feed_consumed: number
    mortality_count: number
  }>
}

export interface CattleProductionReport {
  period: string
  total_cattle: number
  total_milk_production: number
  average_milk_per_cow: number
  total_weight_gain: number
  health_status_summary: {
    healthy: number
    sick: number
    injured: number
    pregnant: number
  }
  production_by_animal: Array<{
    cattle_id: number
    tag_number: string
    milk_production: number
    weight_gain: number
    health_status: string
  }>
}

export interface StockMovementReport {
  period: string
  total_movements: number
  total_in_quantity: number
  total_out_quantity: number
  movements_by_category: Array<{
    category_id: number
    category_name: string
    in_quantity: number
    out_quantity: number
    net_quantity: number
  }>
  low_stock_items: Array<{
    item_id: number
    item_name: string
    current_quantity: number
    minimum_quantity: number
    unit: string
  }>
}

export interface CropPerformanceReport {
  period: string
  total_crops: number
  total_area: number
  total_yield: number
  average_yield_per_hectare: number
  crops_by_status: {
    planted: number
    growing: number
    harvested: number
    failed: number
  }
  performance_by_crop: Array<{
    crop_id: number
    crop_name: string
    variety: string
    planted_area: number
    actual_yield: number
    yield_per_hectare: number
    status: string
  }>
}

export interface FinancialSummaryReport {
  period: string
  total_income: number
  total_expenses: number
  net_profit: number
  profit_margin: number
  income_by_category: Array<{
    category: string
    amount: number
    percentage: number
  }>
  expenses_by_category: Array<{
    category: string
    amount: number
    percentage: number
  }>
  monthly_breakdown: Array<{
    month: string
    income: number
    expenses: number
    profit: number
  }>
}

// Rapports de production avicole
export const getPoultryProductionReport = async (params?: {
  start_date?: string
  end_date?: string
  flock_id?: number
}): Promise<PoultryProductionReport> => {
  const response = await api.get("/reports/poultry-production", { params })
  return response.data.data
}

// Rapports de production bovine
export const getCattleProductionReport = async (params?: {
  start_date?: string
  end_date?: string
  cattle_id?: number
}): Promise<CattleProductionReport> => {
  const response = await api.get("/reports/cattle-production", { params })
  return response.data.data
}

// Rapports de mouvements de stock
export const getStockMovementReport = async (params?: {
  start_date?: string
  end_date?: string
  category_id?: number
}): Promise<StockMovementReport> => {
  const response = await api.get("/reports/stock-movements", { params })
  return response.data.data
}

// Rapports de performance des cultures
export const getCropPerformanceReport = async (params?: {
  start_date?: string
  end_date?: string
  crop_id?: number
  zone_id?: number
}): Promise<CropPerformanceReport> => {
  const response = await api.get("/reports/crop-performance", { params })
  return response.data.data
}

// Résumé financier
export const getFinancialSummaryReport = async (params?: {
  start_date?: string
  end_date?: string
  report_type?: "monthly" | "quarterly" | "yearly"
}): Promise<FinancialSummaryReport> => {
  const response = await api.get("/reports/financial-summary", { params })
  return response.data.data
}
