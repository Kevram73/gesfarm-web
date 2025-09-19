"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import { LayoutMinimal } from "@/lib/components/layout/layout-minimal"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  
  const { forgotPassword, isLoading, error, clearError } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await forgotPassword({ email })
      setIsEmailSent(true)
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useAuth
      console.error("Erreur lors de l'envoi de l'email:", error)
    }
  }

  if (isEmailSent) {
    return (
      <LayoutMinimal>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
          <div className="w-full max-w-md">
            {/* Logo et titre */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">G</span>
              </div>
              <h1 className="text-3xl font-bold text-white">GESFARM</h1>
            </div>

            {/* Message de succès */}
            <Card className="shadow-xl border-0 bg-gray-800">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-white">
                  Email envoyé !
                </CardTitle>
                <p className="text-gray-300 text-sm">
                  Vérifiez votre boîte de réception
                </p>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                <p className="text-gray-300">
                  Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-400">
                  Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier spam.
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => setIsEmailSent(false)}
                    variant="outline"
                    className="w-full text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Renvoyer l'email
                  </Button>
                  
                  <Link href="/">
                    <Button
                      variant="ghost"
                      className="w-full text-gray-300 hover:text-white"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Retour à la connexion
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutMinimal>
    )
  }

  return (
    <LayoutMinimal>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="w-full max-w-md">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">G</span>
            </div>
            <h1 className="text-3xl font-bold text-white">GESFARM</h1>
            <p className="text-gray-300 mt-2">Gestion d'exploitation agropastorale</p>
          </div>

          {/* Formulaire de mot de passe oublié */}
          <Card className="shadow-xl border-0 bg-gray-800">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-white flex items-center justify-center">
                <Mail className="mr-2 h-6 w-6 text-blue-400" />
                Mot de passe oublié
              </CardTitle>
              <p className="text-gray-300 text-sm">
                Entrez votre adresse email pour recevoir un lien de réinitialisation
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Message d'erreur */}
                {error && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <Mail className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    required
                    value={email}
                    onChange={handleInputChange}
                    className="h-11 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                
                {/* Bouton d'envoi */}
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer le lien
                    </>
                  )}
                </Button>
              </form>
              
              {/* Liens utiles */}
              <div className="mt-6 text-center">
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400">
              © 2024 GESFARM. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </LayoutMinimal>
  )
}
