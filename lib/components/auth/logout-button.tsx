"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ 
  variant = "ghost", 
  size = "default",
  className = ""
}: LogoutButtonProps) {
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Déconnexion
    </Button>
  )
}
