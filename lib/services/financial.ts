import api from "./api"

export interface Transaction {
  id: number
  type: "income" | "expense" | "transfer"
  category: string
  description: string
  amount: number
  currency: string
  transaction_date: string
  payment_method: "cash" | "bank_transfer" | "check" | "mobile_money" | "other"
  reference_number?: string
  related_entity_type?: "crop" | "cattle" | "poultry" | "stock" | "zone"
  related_entity_id?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: number
  name: string
  category: string
  allocated_amount: number
  spent_amount: number
  remaining_amount: number
  period_start: string
  period_end: string
  status: "active" | "completed" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateTransactionData {
  type: "income" | "expense" | "transfer"
  category: string
  description: string
  amount: number
  currency: string
  transaction_date: string
  payment_method: "cash" | "bank_transfer" | "check" | "mobile_money" | "other"
  reference_number?: string
  related_entity_type?: "crop" | "cattle" | "poultry" | "stock" | "zone"
  related_entity_id?: number
  notes?: string
}

export interface CreateBudgetData {
  name: string
  category: string
  allocated_amount: number
  period_start: string
  period_end: string
  notes?: string
}

// Transactions
export const getTransactions = async (params?: {
  page?: number
  per_page?: number
  type?: string
  category?: string
  start_date?: string
  end_date?: string
  search?: string
}): Promise<{ items: Transaction[]; pagination: any }> => {
  const response = await api.get("/financial/transactions", { params })
  return response.data.data
}

export const getTransaction = async (id: number): Promise<Transaction> => {
  const response = await api.get(`/financial/transactions/${id}`)
  return response.data.data
}

export const createTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
  const response = await api.post("/financial/transactions", data)
  return response.data.data
}

export const updateTransaction = async (id: number, data: Partial<CreateTransactionData>): Promise<Transaction> => {
  const response = await api.put(`/financial/transactions/${id}`, data)
  return response.data.data
}

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`/financial/transactions/${id}`)
}

// Budgets
export const getBudgets = async (params?: {
  page?: number
  per_page?: number
  status?: string
  category?: string
}): Promise<{ items: Budget[]; pagination: any }> => {
  const response = await api.get("/financial/budgets", { params })
  return response.data.data
}

export const createBudget = async (data: CreateBudgetData): Promise<Budget> => {
  const response = await api.post("/financial/budgets", data)
  return response.data.data
}

// Rapports financiers
export const getFinancialReports = async (params?: {
  start_date?: string
  end_date?: string
  report_type?: "summary" | "detailed" | "category_breakdown"
}): Promise<any> => {
  const response = await api.get("/financial/reports", { params })
  return response.data.data
}
