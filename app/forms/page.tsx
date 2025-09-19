"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LayoutSimple } from "@/lib/components/layout/layout-simple"
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/components/ui/card"
import { Button } from "@/lib/components/ui/button"
import { Input } from "@/lib/components/ui/input"
import { Label } from "@/lib/components/ui/label"
import { Textarea } from "@/lib/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select"
import { userSchema, type UserFormData } from "@/lib/schemas/user-schema"
import { toast } from "react-hot-toast"
import { User, Mail, Phone, Globe, MapPin, Building } from "lucide-react"

export default function FormsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
      },
      company: {
        name: "",
        catchPhrase: "",
        bs: "",
      },
    },
  })

  const onSubmit = async (data: UserFormData) => {
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log("Données du formulaire:", data)
      toast.success("Utilisateur créé avec succès!")
      reset()
    } catch (error) {
      toast.error("Erreur lors de la création de l'utilisateur")
    }
  }

  return (
    <LayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formulaires</h1>
          <p className="text-muted-foreground">
            Exemples de formulaires avec validation en temps réel.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Formulaire principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Créer un utilisateur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Informations de base */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Jean Dupont"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="jean.dupont@example.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+33 1 23 45 67 89"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    {...register("website")}
                    placeholder="https://example.com"
                    className={errors.website ? "border-destructive" : ""}
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive">{errors.website.message}</p>
                  )}
                </div>

                {/* Adresse */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Adresse
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="street">Rue *</Label>
                      <Input
                        id="street"
                        {...register("address.street")}
                        placeholder="123 Rue de la Paix"
                        className={errors.address?.street ? "border-destructive" : ""}
                      />
                      {errors.address?.street && (
                        <p className="text-sm text-destructive">{errors.address.street.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suite">Complément</Label>
                      <Input
                        id="suite"
                        {...register("address.suite")}
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        {...register("address.city")}
                        placeholder="Paris"
                        className={errors.address?.city ? "border-destructive" : ""}
                      />
                      {errors.address?.city && (
                        <p className="text-sm text-destructive">{errors.address.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipcode">Code postal *</Label>
                      <Input
                        id="zipcode"
                        {...register("address.zipcode")}
                        placeholder="75001"
                        className={errors.address?.zipcode ? "border-destructive" : ""}
                      />
                      {errors.address?.zipcode && (
                        <p className="text-sm text-destructive">{errors.address.zipcode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Entreprise */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    Entreprise
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                    <Input
                      id="companyName"
                      {...register("company.name")}
                      placeholder="Acme Corp"
                      className={errors.company?.name ? "border-destructive" : ""}
                    />
                    {errors.company?.name && (
                      <p className="text-sm text-destructive">{errors.company.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="catchPhrase">Slogan</Label>
                    <Input
                      id="catchPhrase"
                      {...register("company.catchPhrase")}
                      placeholder="Votre slogan ici"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bs">Description</Label>
                    <Textarea
                      id="bs"
                      {...register("company.bs")}
                      placeholder="Description de l'entreprise..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Création..." : "Créer l'utilisateur"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => reset()}>
                    Réinitialiser
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Aperçu des données */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu des données</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
                {JSON.stringify(watch(), null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutSimple>
  )
}
