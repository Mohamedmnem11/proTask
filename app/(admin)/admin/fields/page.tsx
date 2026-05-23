'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Loader2,
  MapPin,
  DollarSign,
  Calendar
} from "lucide-react"
import Link from 'next/link'
import { api } from '@/services/api'
import { Input } from '@/components/ui/input'

export default function AdminFieldsPage() {
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadFields()
  }, [])

  async function loadFields() {
    try {
      const data = await api.getFields()
      setFields(data.fields || [])
    } catch (error) {
      console.error('Error loading fields:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteField(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الملعب؟')) return
    
    try {
      await api.deleteField(id)
      await loadFields()
    } catch (error) {
      console.error('Error deleting field:', error)
    }
  }

  const filteredFields = fields.filter((field: any) =>
    field.name?.includes(searchTerm) || 
    field.location?.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">إدارة الملاعب</h1>
        <Link href="/admin/fields/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة ملعب جديد
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="ابحث عن ملعب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fields Grid */}
      {filteredFields.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">لا توجد ملاعب</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFields.map((field: any) => (
            <Card key={field._id} className="overflow-hidden hover:shadow-lg transition">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-green-500" />
              
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-2">{field.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{field.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{field.price} ج/ساعة</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{field.type}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/fields/${field._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Eye className="w-4 h-4" />
                      عرض
                    </Button>
                  </Link>
                  <Link href={`/admin/fields/${field._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Edit className="w-4 h-4" />
                      تعديل
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteField(field._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}