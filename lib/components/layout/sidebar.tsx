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
  User
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Stocks", href: "/stocks", icon: Package },
  { name: "Volailles", href: "/poultry", icon: Egg },
  { name: "Bovins", href: "/cattle", icon: Milk },
  { name: "Cultures", href: "/crops", icon: Wheat },
  { name: "Zones", href: "/zones", icon: Map },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Rapports", href: "/reports", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profil", href: "/profile", icon: User },
  { name: "Paramètres", href: "/settings", icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
                      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
                        GESFARM
                      </h2>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start text-left",
                                isActive
                                  ? "bg-blue-600 text-white border-r-2 border-blue-400"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                              )}
                  asChild
                >
                  <Link href={item.href}>
                                <item.icon className={cn(
                                  "mr-3 h-4 w-4",
                                  isActive ? "text-white" : "text-gray-400"
                                )} />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
