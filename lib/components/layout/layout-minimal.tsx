"use client"

interface LayoutMinimalProps {
  children: React.ReactNode
}

export function LayoutMinimal({ children }: LayoutMinimalProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
