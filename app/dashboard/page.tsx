import dynamic from "next/dynamic"

// Import dynamique pour éviter les problèmes SSR et les boucles
const DashboardClient = dynamic(() => import("./dashboard-client"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-300">Chargement du dashboard...</p>
      </div>
    </div>
  )
})

export default function DashboardPage() {
  return <DashboardClient />
}