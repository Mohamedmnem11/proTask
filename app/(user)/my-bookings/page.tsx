import { Suspense } from 'react'
import MyBookingsContent from './MyBookingsContent'

export default function MyBookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">جاري تحميل حجوزاتك...</p>
        </div>
      </div>
    }>
      <MyBookingsContent />
    </Suspense>
  )
}