'use client'

import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import FieldGrid from '@/components/fields/FieldGrid'
import { Loader2 } from 'lucide-react'

export default function FieldsPage() {
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFields()
  }, [])

  async function loadFields() {
    try {
      setLoading(true)
      const data = await api.getFields()
      console.log('Fields data:', data) // للتصحيح
      setFields(data.fields || [])
    } catch (err: any) {
      console.error('Error loading fields:', err)
      setError(err.message || 'حدث خطأ في جلب الملاعب')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الملاعب...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadFields}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  if (!fields || fields.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">لا توجد ملاعب متاحة حالياً</p>
          <button 
            onClick={loadFields}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">الملاعب المتاحة</h1>
      <FieldGrid fields={fields} />
    </div>
  )
}