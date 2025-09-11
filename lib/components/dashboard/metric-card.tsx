import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Badge } from "@/lib/components/ui/badge"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  description?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  description,
  className
}: MetricCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className={cn("bg-white border-gray-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change !== undefined && (
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {isPositive && <TrendingUp className="h-3 w-3 text-green-500" />}
            {isNegative && <TrendingDown className="h-3 w-3 text-red-500" />}
            <span className={cn(
              "font-medium",
              isPositive && "text-green-600",
              isNegative && "text-red-600"
            )}>
              {change > 0 ? "+" : ""}{change}%
            </span>
            {changeLabel && (
              <span>par rapport à {changeLabel}</span>
            )}
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
