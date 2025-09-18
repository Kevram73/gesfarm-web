"use client"

import { AuthGuard } from "@/lib/components/auth/auth-guard"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Badge } from "@/lib/components/ui/badge"
import { Input } from "@/lib/components/ui/input"
import { 
  useFinancialSummary, 
  useFinancialTransactions, 
  useFinancialAlerts,
  useBudgets 
} from "@/lib/hooks/use-api-data"
import { useRouter } from "next/navigation"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  PieChart,
  BarChart3,
  Calendar,
  Target
} from "lucide-react"
import { useState } from "react"

export default function FinancialPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Hooks pour les données financières
  const { data: summary, isLoading: summaryLoading } = useFinancialSummary({ 
    period: selectedPeriod 
  })
  const { data: transactions, isLoading: transactionsLoading } = useFinancialTransactions({ 
    per_page: 10,
    search: searchTerm 
  })
  const { data: alerts, isLoading: alertsLoading } = useFinancialAlerts()
  const { data: budgets, isLoading: budgetsLoading } = useBudgets({ 
    status: 'active' 
  })

  // Données par défaut si les API ne sont pas disponibles
  const defaultSummary = {
    total_income: 0,
    total_expenses: 0,
    net_profit: 0,
    profit_margin: 0,
    monthly_income: 0,
    monthly_expenses: 0,
    monthly_profit: 0,
    yearly_income: 0,
    yearly_expenses: 0,
    yearly_profit: 0,
    top_income_categories: [],
    top_expense_categories: [],
    monthly_trend: []
  }

  const defaultAlerts: any[] = []
  const defaultBudgets: any[] = []
  const defaultTransactions: any[] = []

  const financialData = summary || defaultSummary
  const alertsData = alerts || defaultAlerts
  const budgetsData = budgets || defaultBudgets
  const transactionsData = transactions?.data || defaultTransactions

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? "text-green-600" : "text-red-600"
  }

  const getProfitIcon = (profit: number) => {
    return profit >= 0 ? TrendingUp : TrendingDown
  }

  if (summaryLoading) {
    return (
      <AuthGuard>
        <LayoutSimple>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">Chargement des données financières</h2>
                <p className="text-gray-500">Veuillez patienter...</p>
              </div>
            </div>
          </div>
        </LayoutSimple>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <LayoutSimple>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-light text-gray-900">Tableau de Bord Financier</h1>
                  <p className="text-gray-500 mt-3 text-lg">
                    Suivi des revenus, dépenses et performance financière
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline"
                    className="border-gray-200 hover:border-green-500 hover:text-green-600"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                  <Button 
                    onClick={() => router.push("/financial/transactions/add")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle Transaction
                  </Button>
                </div>
              </div>
            </div>

            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Revenus Totaux</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(financialData.total_income)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-full">
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Dépenses Totales</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(financialData.total_expenses)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${
                      financialData.net_profit >= 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {(() => {
                        const Icon = getProfitIcon(financialData.net_profit)
                        return <Icon className={`h-6 w-6 ${
                          financialData.net_profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`} />
                      })()}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Bénéfice Net</p>
                      <p className={`text-2xl font-bold ${getProfitColor(financialData.net_profit)}`}>
                        {formatCurrency(financialData.net_profit)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Marge de Profit</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {financialData.profit_margin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertes et Budgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Alertes Financières */}
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      Alertes Financières
                    </CardTitle>
                    <Badge className={`${
                      alertsData.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {alertsData.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {alertsData.length > 0 ? (
                    <div className="space-y-3">
                      {alertsData.slice(0, 3).map((alert: any) => (
                        <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                            <p className="text-xs text-gray-600">{alert.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-500">Aucune alerte financière</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Budgets Actifs */}
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      Budgets Actifs
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push("/financial/budgets/add")}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Nouveau
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {budgetsData.length > 0 ? (
                    <div className="space-y-3">
                      {budgetsData.slice(0, 3).map((budget: any) => {
                        const percentage = (budget.spent / budget.amount) * 100
                        return (
                          <div key={budget.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-900">{budget.name}</p>
                              <span className="text-xs text-gray-500">
                                {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  percentage > 90 ? 'bg-red-500' : 
                                  percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {percentage.toFixed(1)}% utilisé
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-500">Aucun budget actif</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => router.push("/financial/budgets/add")}
                      >
                        Créer un budget
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Transactions Récentes */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Transactions Récentes
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => router.push("/financial/transactions")}
                    >
                      Voir tout
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {transactionsData.length > 0 ? (
                  <div className="space-y-3">
                    {transactionsData.map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'income' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-xs text-gray-500">
                              {transaction.category} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3">
                      <DollarSign className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-500">Aucune transaction récente</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => router.push("/financial/transactions/add")}
                    >
                      Ajouter une transaction
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </LayoutSimple>
    </AuthGuard>
  )
}
