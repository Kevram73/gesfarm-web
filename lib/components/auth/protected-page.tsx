"use client"

import { AuthGuard } from "./auth-guard"
import { Layout } from "../layout/layout"

interface ProtectedPageProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function ProtectedPage({ children, title, description }: ProtectedPageProps) {
  return (
    <AuthGuard>
      <Layout>
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
            {description && (
              <p className="text-gray-300 mt-2">{description}</p>
            )}
          </div>
        )}
        {children}
      </Layout>
    </AuthGuard>
  )
}
