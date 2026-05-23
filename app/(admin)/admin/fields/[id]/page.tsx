'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, ChevronRight, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditFieldPage() {
  const router = useRouter()
  const params = useParams()
  const fieldId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    type: '',
    description: '',
    amenities: [] as string[]
  })

  useEffect(() => {
    if (fieldId) {
      loadField()
    }
  }, [fieldId])

  async function loadField() {
    try {
      const data = await api.getField(fieldId)
      const field = data.field
      setFormData({
        name: field.name || '',
        location: field.location || '',
        price: field.price?.toString() || '',
        type: field.type || '',
        description: field.description || '',
        amenities: field.amenities || []
      })
    } catch (error) {
      console.error('Error loading field:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      await api.updateField(fieldId, {
        ...formData,
        price: parseFloat(formData.price)
      })
      router.push('/admin/fields')
    } catch (error) {
      console.error('Error updating field:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin" className="hover:text-blue-600">لوحة التحكم</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/admin/fields" className="hover:text-blue-600">إدارة الملاعب</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">تعديل ملعب</span>
      </div>

      <h1 className="text-3xl font-bold">تعديل الملعب</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معلومات الملعب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم الملعب</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">الموقع</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (ج/ساعة)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">نوع الملعب</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(v) => setFormData({...formData, type: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="عشب طبيعي">عشب طبيعي</SelectItem>
                        <SelectItem value="نجيل صناعي">نجيل صناعي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المرافق والخدمات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'wifi', 'cafe', 'parking', 'secure',
                    'dressing_rooms', 'night_lighting', 'showers', 'equipment_rental'
                  ].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="rounded"
                      />
                      <span>
                        {amenity === 'wifi' && 'واي فاي'}
                        {amenity === 'cafe' && 'كافيتريا'}
                        {amenity === 'parking' && 'موقف سيارات'}
                        {amenity === 'secure' && 'أمان'}
                        {amenity === 'dressing_rooms' && 'غرف تبديل ملابس'}
                        {amenity === 'night_lighting' && 'إضاءة ليلية'}
                        {amenity === 'showers' && 'دش'}
                        {amenity === 'equipment_rental' && 'تأجير معدات'}
                      </span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>صور الملعب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="text-sm text-gray-600 mb-1">تغيير الصور</p>
                  <p className="text-xs text-gray-500">اختر صور جديدة</p>
                  <Button variant="outline" className="mt-4" type="button">
                    اختيار صور
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>حالة الملعب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="status" defaultChecked className="rounded" />
                    <span>نشط (متاح للحجز)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="status" className="rounded" />
                    <span>صيانة (غير متاح مؤقتاً)</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الحفظ...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    حفظ التغييرات
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}