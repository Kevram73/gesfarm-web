import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  address: z.object({
    street: z.string().min(1, "La rue est requise"),
    suite: z.string().optional(),
    city: z.string().min(1, "La ville est requise"),
    zipcode: z.string().min(1, "Le code postal est requis"),
  }).optional(),
  company: z.object({
    name: z.string().min(1, "Le nom de l'entreprise est requis"),
    catchPhrase: z.string().optional(),
    bs: z.string().optional(),
  }).optional(),
})

export type UserFormData = z.infer<typeof userSchema>
