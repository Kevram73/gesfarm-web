import api from "./api"

// ===== TYPES FINANCIERS =====
export interface FinancialTransaction {
  id: number
  type: 'income' | 'expense'
  category: string
  subcategory?: string
  amount: number
  description: string
  date: string
  reference?: string
  related_entity_type?: 'cattle' | 'poultry' | 'crops' | 'stock' | 'veterinary'
  related_entity_id?: number
  created_at: string
  updated_at: string
}

export interface Budget {
  id: number
  name: string
  category: string
  amount: number
  spent: number
  period: 'monthly' | 'quarterly' | 'yearly'
  start_date: string
  end_date: string
  status: 'active' | 'completed' | 'overdue'
  created_at: string
  updated_at: string
}

export interface FinancialSummary {
  total_income: number
  total_expenses: number
  net_profit: number
  profit_margin: number
  monthly_income: number
  monthly_expenses: number
  monthly_profit: number
  yearly_income: number
  yearly_expenses: number
  yearly_profit: number
  top_income_categories: Array<{
    category: string
    amount: number
    percentage: number
  }>
  top_expense_categories: Array<{
    category: string
    amount: number
    percentage: number
  }>
  monthly_trend: Array<{
    month: string
    income: number
    expenses: number
    profit: number
  }>
}

export interface FinancialAlert {
  id: number
  type: 'budget_exceeded' | 'low_cash_flow' | 'unusual_expense' | 'missing_income'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  amount?: number
  threshold?: number
  created_at: string
  is_read: boolean
}

// ===== API FUNCTIONS =====

// Transactions financières
export const getFinancialTransactions = async (params?: {
  page?: number
  per_page?: number
  type?: 'income' | 'expense'
  category?: string
  start_date?: string
  end_date?: string
  search?: string
}): Promise<{ data: FinancialTransaction[]; meta: any }> => {
  const response = await api.get("/financial/transactions", { params })
  return {
    data: response.data.data.transactions || response.data.data.data || [],
    meta: response.data.data.pagination || response.data.data.meta || {}
  }
}

export const createFinancialTransaction = async (data: Partial<FinancialTransaction>): Promise<FinancialTransaction> => {
  const response = await api.post("/financial/transactions", data)
  return response.data.data
}

export const updateFinancialTransaction = async (id: number, data: Partial<FinancialTransaction>): Promise<FinancialTransaction> => {
  const response = await api.put(`/financial/transactions/${id}`, data)
  return response.data.data
}

export const deleteFinancialTransaction = async (id: number): Promise<void> => {
  await api.delete(`/financial/transactions/${id}`)
}

// Budgets
export const getBudgets = async (params?: {
  page?: number
  per_page?: number
  status?: string
  period?: string
}): Promise<{ data: Budget[]; meta: any }> => {
  const response = await api.get("/financial/budgets", { params })
  return {
    data: response.data.data.budgets || response.data.data.data || [],
    meta: response.data.data.pagination || response.data.data.meta || {}
  }
}

export const createBudget = async (data: Partial<Budget>): Promise<Budget> => {
  const response = await api.post("/financial/budgets", data)
  return response.data.data
}

export const updateBudget = async (id: number, data: Partial<Budget>): Promise<Budget> => {
  const response = await api.put(`/financial/budgets/${id}`, data)
  return response.data.data
}

export const deleteBudget = async (id: number): Promise<void> => {
  await api.delete(`/financial/budgets/${id}`)
}

// Résumé financier
export const getFinancialSummary = async (params?: {
  start_date?: string
  end_date?: string
  period?: 'month' | 'quarter' | 'year'
}): Promise<FinancialSummary> => {
  const response = await api.get("/financial/summary", { params })
  return response.data.data
}

// Alertes financières
export const getFinancialAlerts = async (): Promise<FinancialAlert[]> => {
  const response = await api.get("/financial/alerts")
  return response.data.data
}

export const markFinancialAlertAsRead = async (id: number): Promise<void> => {
  await api.put(`/financial/alerts/${id}/read`)
}

// Catégories financières
export const getFinancialCategories = async (): Promise<{
  income_categories: string[]
  expense_categories: string[]
}> => {
  const response = await api.get("/financial/categories")
  return response.data.data
}

// Import/Export
export const exportFinancialData = async (params?: {
  start_date?: string
  end_date?: string
  format?: 'csv' | 'excel' | 'pdf'
}): Promise<Blob> => {
  const response = await api.get("/financial/export", { 
    params,
    responseType: 'blob'
  })
  return response.data
}

export const importFinancialData = async (file: File): Promise<{
  imported: number
  errors: string[]
}> => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post("/financial/import", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data.data
}