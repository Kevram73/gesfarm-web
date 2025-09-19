"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/lib/components/ui/button"
import { LogOut } from "lucide-react"
import { logout } from "@/lib/hooks/use-auth-global"

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
  const router = useRouter()

  const handleLogout = () => {
    // Déconnecter l'utilisateur
    logout()
    
    // Rediriger vers la page de connexion
    router.push("/login")
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
