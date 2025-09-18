"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/services/api"
import { useAuthGlobal } from "./use-auth-global"

// ===== TYPES =====
export interface DashboardKPIs {
  total_poultry: number
  total_cattle: number
  total_crops: number
  total_zones: number
  production_summary: {
    eggs_today: number
    milk_today: number
  }
  total_revenue?: number
  total_expenses?: number
  net_profit?: number
}

export interface StockItem {
  id: number
  name: string
  sku: string
  category_id: number
  category_name: string
  current_stock: number
  min_stock: number
  max_stock: number
  unit: string
  unit_price: number
  expiry_date?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface StockAlert {
  id: number
  item_id: number
  item_name: string
  current_stock: number
  min_stock: number
  alert_type: 'low_stock' | 'expired' | 'near_expiry'
  severity: 'low' | 'medium' | 'high'
  created_at: string
}

export interface PoultryFlock {
  id: number
  flock_number: string
  breed: string
  type: 'layer' | 'broiler' | 'dual_purpose'
  initial_count: number
  current_count: number
  age_days: number
  zone_id: number
  zone_name: string
  status: 'active' | 'sold' | 'depleted'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Cattle {
  id: number
  tag_number: string
  name: string
  breed: string
  gender: 'male' | 'female'
  birth_date: string
  mother_tag?: string
  father_tag?: string
  current_weight: number
  status: 'active' | 'sold' | 'deceased'
  zone_id: number
  zone_name: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Crop {
  id: number
  name: string
  variety: string
  zone_id: number
  zone_name: string
  planting_date: string
  expected_harvest_date: string
  actual_harvest_date?: string
  planted_area: number
  expected_yield: number
  actual_yield?: number
  status: 'planted' | 'growing' | 'harvested' | 'failed'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Zone {
  id: number
  name: string
  type: 'cultivation' | 'pasture' | 'enclosure' | 'building' | 'water_point'
  area: number
  capacity?: number
  current_occupancy?: number
  description?: string
  coordinates?: {
    type: string
    coordinates: number[]
  } | string
  status?: 'active' | 'inactive' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  assigned_to: number
  assigned_to_name: string
  due_date: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Role {
  id: number
  name: string
  display_name: string
  description?: string
}

export interface Permission {
  id: number
  name: string
  display_name: string
  description?: string
}

export interface Transaction {
  id: number
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: string
  reference?: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: number
  name: string
  category: string
  allocated_amount: number
  spent_amount: number
  period_start: string
  period_end: string
  created_at: string
  updated_at: string
}

export interface FinancialReport {
  id: number
  name: string
  type: string
  period: string
  data: any
  created_at: string
}

export interface Treatment {
  id: number
  animal_type: 'poultry' | 'cattle'
  animal_id: number
  animal_name: string
  treatment_type: string
  medication: string
  dosage: string
  veterinarian: string
  treatment_date: string
  next_due_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ScheduleItem {
  id: number
  title: string
  description: string
  date: string
  time: string
  type: string
  animal_type?: string
  animal_id?: number
}

export interface Reminder {
  id: number
  title: string
  message: string
  due_date: string
  type: string
  animal_type?: string
  animal_id?: number
  is_completed: boolean
}

export interface VeterinaryStats {
  total_treatments: number
  treatments_this_month: number
  upcoming_treatments: number
  overdue_treatments: number
}

export interface PoultryProductionReport {
  total_eggs: number
  eggs_this_month: number
  average_daily_production: number
  mortality_rate: number
  feed_efficiency: number
}

export interface CattleProductionReport {
  total_milk: number
  milk_this_month: number
  average_daily_milk: number
  breeding_success_rate: number
  weight_gain: number
}

export interface StockMovementsReport {
  total_movements: number
  movements_this_month: number
  total_value: number
  top_items: Array<{
    name: string
    quantity: number
    value: number
  }>
}

export interface CropPerformanceReport {
  total_harvest: number
  harvest_this_season: number
  yield_per_hectare: number
  success_rate: number
  top_crops: Array<{
    name: string
    yield: number
    area: number
  }>
}

export interface FinancialSummaryReport {
  total_income: number
  total_expenses: number
  net_profit: number
  profit_margin: number
  monthly_trend: Array<{
    month: string
    income: number
    expenses: number
    profit: number
  }>
}

export interface PoultryAnalytics {
  production_trend: Array<{
    date: string
    eggs: number
    mortality: number
  }>
  breed_performance: Array<{
    breed: string
    production: number
    efficiency: number
  }>
  health_metrics: {
    vaccination_rate: number
    mortality_rate: number
    feed_conversion: number
  }
}

export interface CattleAnalytics {
  production_trend: Array<{
    date: string
    milk: number
    weight: number
  }>
  breed_performance: Array<{
    breed: string
    milk_production: number
    weight_gain: number
  }>
  health_metrics: {
    vaccination_rate: number
    breeding_success: number
    feed_efficiency: number
  }
}

export interface CropAnalytics {
  yield_trend: Array<{
    season: string
    yield: number
    area: number
  }>
  crop_performance: Array<{
    crop: string
    yield_per_hectare: number
    success_rate: number
  }>
  seasonal_metrics: {
    planting_success: number
    harvest_success: number
    weather_impact: number
  }
}

export interface FarmOverviewAnalytics {
  total_animals: number
  total_crops: number
  total_zones: number
  production_summary: {
    eggs_today: number
    milk_today: number
    crops_ready: number
  }
  financial_summary: {
    monthly_income: number
    monthly_expenses: number
    net_profit: number
  }
  alerts: Array<{
    type: string
    message: string
    severity: string
  }>
}

// ===== QUERY KEYS =====
export const apiKeys = {
  dashboard: () => ['dashboard'] as const,
  stockAlerts: () => ['stock-alerts'] as const,
  stockItems: (params?: any) => ['stock-items', params] as const,
  poultryFlocks: (params?: any) => ['poultry-flocks', params] as const,
  cattle: (params?: any) => ['cattle', params] as const,
  crops: (params?: any) => ['crops', params] as const,
  zones: (params?: any) => ['zones', params] as const,
  notifications: (params?: any) => ['notifications', params] as const,
  tasks: (params?: any) => ['tasks', params] as const,
  users: (params?: any) => ['users', params] as const,
  roles: () => ['roles'] as const,
  permissions: () => ['permissions'] as const,
  transactions: (params?: any) => ['transactions', params] as const,
  budgets: () => ['budgets'] as const,
  treatments: (params?: any) => ['treatments', params] as const,
  reports: (type: string) => ['reports', type] as const,
  analytics: (type: string) => ['analytics', type] as const,
}

// ===== API FUNCTIONS =====
export const getDashboardKPIs = async (): Promise<DashboardKPIs> => {
  const response = await api.get("/dashboard")
  return response.data.data
}

export const getStockAlerts = async (): Promise<StockAlert[]> => {
  const response = await api.get("/dashboard/stock-alerts")
  return response.data.data
}

export const getPoultryStats = async () => {
  const response = await api.get("/dashboard/poultry-stats")
  return response.data.data
}

export const getCattleStats = async () => {
  const response = await api.get("/dashboard/cattle-stats")
  return response.data.data
}

export const getCropStats = async () => {
  const response = await api.get("/dashboard/crop-stats")
  return response.data.data
}

export const getTaskStats = async () => {
  const response = await api.get("/dashboard/task-stats")
  return response.data.data
}

export const getStockItems = async (params?: {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
}): Promise<{ data: StockItem[]; meta: any }> => {
  const response = await api.get("/stock/items", { params })
  return {
    data: response.data.data.items || response.data.data.stock_items || response.data.data.data || [],
    meta: response.data.data.pagination || response.data.data.meta || {}
  }
}

export const createStockItem = async (data: Partial<StockItem>): Promise<StockItem> => {
  const response = await api.post("/stock/items", data)
  return response.data.data
}

export const updateStockItem = async (id: number, data: Partial<StockItem>): Promise<StockItem> => {
  const response = await api.put(`/stock/items/${id}`, data)
  return response.data.data
}

export const deleteStockItem = async (id: number): Promise<void> => {
  await api.delete(`/stock/items/${id}`)
}

export const getPoultryFlocks = async (params?: {
  page?: number
  per_page?: number
  search?: string
  status?: string
}): Promise<{ data: PoultryFlock[]; meta: any }> => {
  const response = await api.get("/poultry/flocks", { params })
  return {
    data: response.data.data.flocks || response.data.data.poultry_flocks || response.data.data.data || [],
    meta: response.data.data.pagination || response.data.data.meta || {}
  }
}

export const createPoultryFlock = async (data: Partial<PoultryFlock>): Promise<PoultryFlock> => {
  const response = await api.post("/poultry/flocks", data)
  return response.data.data
}

export const updatePoultryFlock = async (id: number, data: Partial<PoultryFlock>): Promise<PoultryFlock> => {
  const response = await api.put(`/poultry/flocks/${id}`, data)
  return response.data.data
}

export const deletePoultryFlock = async (id: number): Promise<void> => {
  await api.delete(`/poultry/flocks/${id}`)
}

export const getCattle = async (params?: {
  page?: number
  per_page?: number
  search?: string
  status?: string
}): Promise<{ data: Cattle[]; meta: any }> => {
  const response = await api.get("/cattle", { params })
  return {
    data: response.data.data.cattle,
    meta: response.data.data.pagination
  }
}

export const createCattle = async (data: Partial<Cattle>): Promise<Cattle> => {
  const response = await api.post("/cattle", data)
  return response.data.data
}

export const updateCattle = async (id: number, data: Partial<Cattle>): Promise<Cattle> => {
  const response = await api.put(`/cattle/${id}`, data)
  return response.data.data
}

export const deleteCattle = async (id: number): Promise<void> => {
  await api.delete(`/cattle/${id}`)
}

export const getCrops = async (params?: {
  page?: number
  per_page?: number
  search?: string
  status?: string
}): Promise<{ data: Crop[]; meta: any }> => {
  const response = await api.get("/crops", { params })
  return {
    data: response.data.data.crops || response.data.data.data || [],
    meta: response.data.data.pagination || response.data.data.meta || {}
  }
}

export const createCrop = async (data: Partial<Crop>): Promise<Crop> => {
  const response = await api.post("/crops", data)
  return response.data.data
}

export const updateCrop = async (id: number, data: Partial<Crop>): Promise<Crop> => {
  const response = await api.put(`/crops/${id}`, data)
  return response.data.data
}

export const deleteCrop = async (id: number): Promise<void> => {
  await api.delete(`/crops/${id}`)
}

export const getZones = async (params?: {
  page?: number
  per_page?: number
  search?: string
}): Promise<{ data: Zone[]; meta: any }> => {
  const response = await api.get("/zones", { params })
  return {
    data: response.data.data.zones || response.data.data.data || [],
    meta: response.data.data.pagination || response.data.data.meta || {}
  }
}

export const createZone = async (data: Partial<Zone>): Promise<Zone> => {
  const response = await api.post("/zones", data)
  return response.data.data
}

export const updateZone = async (id: number, data: Partial<Zone>): Promise<Zone> => {
  const response = await api.put(`/zones/${id}`, data)
  return response.data.data
}

export const deleteZone = async (id: number): Promise<void> => {
  await api.delete(`/zones/${id}`)
}

export const getNotifications = async (params?: {
  page?: number
  per_page?: number
  type?: string
  is_read?: boolean
}): Promise<{ data: Notification[]; meta: any }> => {
  const response = await api.get("/notifications", { params })
  return {
    data: response.data.data.notifications || response.data.data.data || [],
    meta: response.data.data.pagination || response.data.data.meta || {}
  }
}

export const markNotificationAsRead = async (id: number): Promise<void> => {
  await api.put(`/notifications/${id}/read`)
}

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.put("/notifications/mark-all-read")
}

export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/notifications/${id}`)
}

// ===== TASKS API FUNCTIONS =====
export const getTasks = async (params?: {
  page?: number
  per_page?: number
  search?: string
  status?: string
  assigned_to?: number
}): Promise<{ data: Task[]; meta: any }> => {
  const response = await api.get("/tasks", { params })
  return {
    data: response.data.data.tasks || response.data.data.data || [],
    meta: response.data.data.pagination || response.data.data.meta || {}
  }
}

export const createTask = async (data: Partial<Task>): Promise<Task> => {
  const response = await api.post("/tasks", data)
  return response.data.data
}

export const updateTask = async (id: number, data: Partial<Task>): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, data)
  return response.data.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}

export const completeTask = async (id: number): Promise<Task> => {
  const response = await api.put(`/tasks/${id}/complete`)
  return response.data.data
}

export const getMyTasks = async (): Promise<Task[]> => {
  const response = await api.get("/my-tasks")
  return response.data.data
}

// ===== USERS API FUNCTIONS =====
export const getUsers = async (params?: {
  page?: number
  per_page?: number
  search?: string
  role?: string
}): Promise<{ data: User[]; meta: any }> => {
  const response = await api.get("/users", { params })
  return {
    data: response.data.data.users || response.data.data.data || [],
    meta: response.data.data.pagination || response.data.data.meta || {}
  }
}

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await api.post("/users", data)
  return response.data.data
}

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/${id}`, data)
  return response.data.data
}

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`)
}

export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get("/roles")
  return response.data.data
}

export const getPermissions = async (): Promise<Permission[]> => {
  const response = await api.get("/permissions")
  return response.data.data
}

// ===== FINANCIAL API FUNCTIONS =====
export const getTransactions = async (params?: {
  page?: number
  per_page?: number
  type?: string
  category?: string
  date_from?: string
  date_to?: string
}): Promise<{ data: Transaction[]; meta: any }> => {
  const response = await api.get("/financial/transactions", { params })
  return response.data
}

export const createTransaction = async (data: Partial<Transaction>): Promise<Transaction> => {
  const response = await api.post("/financial/transactions", data)
  return response.data.data
}

export const updateTransaction = async (id: number, data: Partial<Transaction>): Promise<Transaction> => {
  const response = await api.put(`/financial/transactions/${id}`, data)
  return response.data.data
}

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/financial/transactions/${id}`)
}

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await api.get("/financial/budgets")
  return response.data.data
}

export const createBudget = async (data: Partial<Budget>): Promise<Budget> => {
  const response = await api.post("/financial/budgets", data)
  return response.data.data
}

export const getFinancialReports = async (): Promise<FinancialReport[]> => {
  const response = await api.get("/financial/reports")
  return response.data.data
}

// ===== VETERINARY API FUNCTIONS =====
export const getTreatments = async (params?: {
  page?: number
  per_page?: number
  animal_type?: string
  animal_id?: number
}): Promise<{ data: Treatment[]; meta: any }> => {
  const response = await api.get("/veterinary/treatments", { params })
  return response.data
}

export const createTreatment = async (data: Partial<Treatment>): Promise<Treatment> => {
  const response = await api.post("/veterinary/treatments", data)
  return response.data.data
}

export const updateTreatment = async (id: number, data: Partial<Treatment>): Promise<Treatment> => {
  const response = await api.put(`/veterinary/treatments/${id}`, data)
  return response.data.data
}

export const deleteTreatment = async (id: number): Promise<void> => {
  await api.delete(`/veterinary/treatments/${id}`)
}

export const getVeterinarySchedule = async (): Promise<ScheduleItem[]> => {
  const response = await api.get("/veterinary/schedule")
  return response.data.data
}

export const getVeterinaryReminders = async (): Promise<Reminder[]> => {
  const response = await api.get("/veterinary/reminders")
  return response.data.data
}

export const getVeterinaryStats = async (): Promise<VeterinaryStats> => {
  const response = await api.get("/veterinary/stats")
  return response.data.data
}

// ===== REPORTS API FUNCTIONS =====
export const getPoultryProductionReport = async (): Promise<PoultryProductionReport> => {
  const response = await api.get("/reports/poultry-production")
  return response.data.data
}

export const getCattleProductionReport = async (): Promise<CattleProductionReport> => {
  const response = await api.get("/reports/cattle-production")
  return response.data.data
}

export const getStockMovementsReport = async (): Promise<StockMovementsReport> => {
  const response = await api.get("/reports/stock-movements")
  return response.data.data
}

export const getCropPerformanceReport = async (): Promise<CropPerformanceReport> => {
  const response = await api.get("/reports/crop-performance")
  return response.data.data
}

export const getFinancialSummaryReport = async (): Promise<FinancialSummaryReport> => {
  const response = await api.get("/reports/financial-summary")
  return response.data.data
}

// ===== ANALYTICS API FUNCTIONS =====
export const getPoultryAnalytics = async (): Promise<PoultryAnalytics> => {
  const response = await api.get("/analytics/poultry")
  return response.data.data
}

export const getCattleAnalytics = async (): Promise<CattleAnalytics> => {
  const response = await api.get("/analytics/cattle")
  return response.data.data
}

export const getCropAnalytics = async (): Promise<CropAnalytics> => {
  const response = await api.get("/analytics/crops")
  return response.data.data
}

export const getFarmOverviewAnalytics = async (): Promise<FarmOverviewAnalytics> => {
  const response = await api.get("/analytics/farm-overview")
  return response.data.data
}

// ===== REACT QUERY HOOKS =====
export function useDashboardKPIs() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.dashboard(), "kpis"],
    queryFn: getDashboardKPIs,
    refetchInterval: 60000,
    enabled: isAuthenticated,
  })
}

export function useStockAlerts() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.stockAlerts()],
    queryFn: getStockAlerts,
    refetchInterval: 30000,
    enabled: isAuthenticated,
  })
}

export function usePoultryStats() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.dashboard(), "poultry-stats"],
    queryFn: getPoultryStats,
    refetchInterval: 60000,
    enabled: isAuthenticated,
  })
}

export function useCattleStats() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.dashboard(), "cattle-stats"],
    queryFn: getCattleStats,
    refetchInterval: 60000,
    enabled: isAuthenticated,
  })
}

export function useCropStats() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.dashboard(), "crop-stats"],
    queryFn: getCropStats,
    refetchInterval: 60000,
    enabled: isAuthenticated,
  })
}

export function useTaskStats() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.dashboard(), "task-stats"],
    queryFn: getTaskStats,
    refetchInterval: 60000,
    enabled: isAuthenticated,
  })
}

export function useStockItems(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.stockItems(params),
    queryFn: () => getStockItems(params),
    enabled: isAuthenticated,
  })
}

export function useCreateStockItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createStockItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.stockItems() })
      queryClient.invalidateQueries({ queryKey: apiKeys.stockAlerts() })
    },
  })
}

export function useUpdateStockItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<StockItem> }) => updateStockItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.stockItems() })
      queryClient.invalidateQueries({ queryKey: apiKeys.stockAlerts() })
    },
  })
}

export function useDeleteStockItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteStockItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.stockItems() })
      queryClient.invalidateQueries({ queryKey: apiKeys.stockAlerts() })
    },
  })
}

export function usePoultryFlocks(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.poultryFlocks(params),
    queryFn: () => getPoultryFlocks(params),
    enabled: isAuthenticated,
  })
}

export function useCreatePoultryFlock() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createPoultryFlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.poultryFlocks() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useUpdatePoultryFlock() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PoultryFlock> }) => updatePoultryFlock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.poultryFlocks() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useDeletePoultryFlock() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deletePoultryFlock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.poultryFlocks() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useCattle(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.cattle(params),
    queryFn: () => getCattle(params),
    enabled: isAuthenticated,
  })
}

export function useCreateCattle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCattle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.cattle() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useUpdateCattle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Cattle> }) => updateCattle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.cattle() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useDeleteCattle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteCattle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.cattle() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useCrops(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.crops(params),
    queryFn: () => getCrops(params),
    enabled: isAuthenticated,
  })
}

export function useCreateCrop() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createCrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.crops() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useUpdateCrop() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Crop> }) => updateCrop(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.crops() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useDeleteCrop() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteCrop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.crops() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useZones(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.zones(params),
    queryFn: () => getZones(params),
    enabled: isAuthenticated,
  })
}

export function useCreateZone() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.zones() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useUpdateZone() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Zone> }) => updateZone(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.zones() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useDeleteZone() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.zones() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useNotifications(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.notifications(params),
    queryFn: () => getNotifications(params),
    refetchInterval: 30000,
    enabled: isAuthenticated,
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.notifications() })
    },
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.notifications() })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.notifications() })
    },
  })
}

// ===== TASKS HOOKS =====
export function useTasks(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.tasks(params),
    queryFn: () => getTasks(params),
    enabled: isAuthenticated,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.tasks() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.tasks() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.tasks() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useCompleteTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.tasks() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useMyTasks() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.tasks(), "my-tasks"],
    queryFn: getMyTasks,
    enabled: isAuthenticated,
  })
}

// ===== USERS HOOKS =====
export function useUsers(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.users(params),
    queryFn: () => getUsers(params),
    enabled: isAuthenticated,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.users() })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.users() })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.users() })
    },
  })
}

export function useRoles() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.roles(),
    queryFn: getRoles,
    enabled: isAuthenticated,
  })
}

export function usePermissions() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.permissions(),
    queryFn: getPermissions,
    enabled: isAuthenticated,
  })
}

// ===== FINANCIAL HOOKS =====
export function useTransactions(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.transactions(params),
    queryFn: () => getTransactions(params),
    enabled: isAuthenticated,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Transaction> }) => updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: apiKeys.dashboard() })
    },
  })
}

export function useBudgets() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.budgets(),
    queryFn: getBudgets,
    enabled: isAuthenticated,
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.budgets() })
    },
  })
}

export function useFinancialReports() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.reports("financial")],
    queryFn: getFinancialReports,
    enabled: isAuthenticated,
  })
}

// ===== VETERINARY HOOKS =====
export function useTreatments(params?: any) {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.treatments(params),
    queryFn: () => getTreatments(params),
    enabled: isAuthenticated,
  })
}

export function useCreateTreatment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTreatment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.treatments() })
    },
  })
}

export function useUpdateTreatment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Treatment> }) => updateTreatment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.treatments() })
    },
  })
}

export function useDeleteTreatment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTreatment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeys.treatments() })
    },
  })
}

export function useVeterinarySchedule() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.treatments(), "schedule"],
    queryFn: getVeterinarySchedule,
    enabled: isAuthenticated,
  })
}

export function useVeterinaryReminders() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.treatments(), "reminders"],
    queryFn: getVeterinaryReminders,
    enabled: isAuthenticated,
  })
}

export function useVeterinaryStats() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: [...apiKeys.treatments(), "stats"],
    queryFn: getVeterinaryStats,
    enabled: isAuthenticated,
  })
}

// ===== REPORTS HOOKS =====
export function usePoultryProductionReport() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.reports("poultry-production"),
    queryFn: getPoultryProductionReport,
    enabled: isAuthenticated,
  })
}

export function useCattleProductionReport() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.reports("cattle-production"),
    queryFn: getCattleProductionReport,
    enabled: isAuthenticated,
  })
}

export function useStockMovementsReport() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.reports("stock-movements"),
    queryFn: getStockMovementsReport,
    enabled: isAuthenticated,
  })
}

export function useCropPerformanceReport() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.reports("crop-performance"),
    queryFn: getCropPerformanceReport,
    enabled: isAuthenticated,
  })
}

export function useFinancialSummaryReport() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.reports("financial-summary"),
    queryFn: getFinancialSummaryReport,
    enabled: isAuthenticated,
  })
}

// ===== ANALYTICS HOOKS =====
export function usePoultryAnalytics() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.analytics("poultry"),
    queryFn: getPoultryAnalytics,
    enabled: isAuthenticated,
  })
}

export function useCattleAnalytics() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.analytics("cattle"),
    queryFn: getCattleAnalytics,
    enabled: isAuthenticated,
  })
}

export function useCropAnalytics() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.analytics("crops"),
    queryFn: getCropAnalytics,
    enabled: isAuthenticated,
  })
}

export function useFarmOverviewAnalytics() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: apiKeys.analytics("farm-overview"),
    queryFn: getFarmOverviewAnalytics,
    enabled: isAuthenticated,
  })
}

// ===== USER PROFILE HOOKS =====
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/profile")
  const userData = response.data.data.user
  
  // Transformer les données pour correspondre à l'interface User
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    phone: userData.phone || undefined,
    role: Array.isArray(userData.roles) ? userData.roles[0] || 'user' : userData.role || 'user',
    is_active: userData.is_active !== undefined ? userData.is_active : true,
    created_at: userData.created_at || new Date().toISOString(),
    updated_at: userData.updated_at || new Date().toISOString()
  }
}

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const response = await api.put("/profile", data)
  return response.data.data
}

export const changePassword = async (data: {
  current_password: string
  new_password: string
  new_password_confirmation: string
}): Promise<void> => {
  await api.put("/password", data)
}

export interface UserSettings {
  id: number
  user_id: number
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  farm_info: {
    name: string
    address: string
    phone: string
    email: string
  }
  created_at: string
  updated_at: string
}

export const getUserSettings = async (): Promise<UserSettings> => {
  const response = await api.get("/settings")
  return response.data.data
}

export const updateUserSettings = async (data: Partial<UserSettings>): Promise<UserSettings> => {
  const response = await api.put("/settings", data)
  return response.data.data
}

export function useCurrentUser() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: ["profile"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
  })
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  })
}

export function useUserSettings() {
  const isAuthenticated = useAuthGlobal()
  
  return useQuery({
    queryKey: ["settings"],
    queryFn: getUserSettings,
    enabled: isAuthenticated,
  })
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] })
    },
  })
}
