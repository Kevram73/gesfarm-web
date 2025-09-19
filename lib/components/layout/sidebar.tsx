"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/lib/components/ui/button"
import { 
  Home, 
  BarChart3, 
  Settings, 
  FileText, 
  Map,
  Bell,
  Package,
  Egg,
  Milk,
  Wheat,
  User,
  DollarSign,
  X,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { 
    name: "Gestion", 
    icon: Package,
    children: [
      { name: "Finances", href: "/financial", icon: DollarSign },
      { name: "Stocks", href: "/stocks", icon: Package },
      { name: "Volailles", href: "/poultry", icon: Egg },
      { name: "Bovins", href: "/cattle", icon: Milk },
      { name: "Cultures", href: "/crops", icon: Wheat },
      { name: "Zones", href: "/zones", icon: Map },
    ]
  },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Rapports", href: "/reports", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profil", href: "/profile", icon: User },
  { name: "Paramètres", href: "/settings", icon: Settings },
  { name: "Test Auth", href: "/test-auth", icon: User },
]

interface SidebarProps {
  className?: string
  onClose?: () => void
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isItemActive = (item: any) => {
    if (item.href) {
      return pathname === item.href
    }
    if (item.children) {
      return item.children.some((child: any) => pathname === child.href)
    }
    return false
  }

  return (
    <div className={cn("pb-12", className)}>
      {/* Header avec bouton de fermeture mobile */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">
          GESFARM
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden h-8 w-8 text-gray-300 hover:bg-gray-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 py-4">
        {navigation.map((item) => {
          const isActive = isItemActive(item)
          const isExpanded = expandedItems.includes(item.name)

          if (item.children) {
            return (
              <div key={item.name} className="px-3">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between text-left font-medium",
                    isActive
                      ? "bg-blue-600 text-white border-r-2 border-blue-400"
                      : "text-gray-300 hover:bg-gray-700"
                  )}
                  onClick={() => toggleExpanded(item.name)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href
                      return (
                        <Button
                          key={child.name}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left text-sm",
                            isChildActive
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:bg-gray-700"
                          )}
                          asChild
                        >
                          <Link href={child.href} onClick={onClose}>
                            <child.icon className="mr-3 h-4 w-4" />
                            {child.name}
                          </Link>
                        </Button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <div key={item.name} className="px-3">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-medium",
                  isActive
                    ? "bg-blue-600 text-white border-r-2 border-blue-400"
                    : "text-gray-300 hover:bg-gray-700"
                )}
                asChild
              >
                <Link href={item.href} onClick={onClose}>
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
