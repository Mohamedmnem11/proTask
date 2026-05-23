"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronRight, Upload } from "lucide-react"
import Link from "next/link"

export default function NewFieldPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // محاكاة إرسال البيانات
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    router.push("/admin/fields")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/admin" className="hover:text-blue-600">لوحة التحكم</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/admin/fields" className="hover:text-blue-600">إدارة الملاعب</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">إضافة ملعب جديد</span>
      </div>

      <h1 className="text-3xl font-bold">إضافة ملعب جديد</h1>

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
                    placeholder="مثال: ملعب النادي الأهلي"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">الموقع</Label>
                  <Input
                    id="location"
                    placeholder="مثال: الجزيرة"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">السعر (ج/ساعة)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="250"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">نوع الملعب</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">عشب طبيعي</SelectItem>
                        <SelectItem value="artificial">نجيل صناعي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    placeholder="وصف الملعب والمرافق المتاحة..."
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
                  {["واي فاي", "كافيتريا", "موقف سيارات", "أمان", "غرف تبديل ملابس", "إضاءة ليلية"].map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>{amenity}</span>
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
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-1">
                    اسحب وأفلت الصور هنا
                  </p>
                  <p className="text-xs text-gray-500">
                    أو اضغط للاختيار
                  </p>
                  <Button variant="outline" className="mt-4" type="button">
                    اختيار صور
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  أقصى حجم 5MB لكل صورة. صيغ JPG, PNG, WEBP
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات إضافية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="minDuration">أقل مدة للحجز (ساعات)</Label>
                  <Input id="minDuration" type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDuration">أقصى مدة للحجز (ساعات)</Label>
                  <Input id="maxDuration" type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancelPolicy">سياسة الإلغاء</Label>
                  <Select defaultValue="12">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">قبل 12 ساعة</SelectItem>
                      <SelectItem value="24">قبل 24 ساعة</SelectItem>
                      <SelectItem value="48">قبل 48 ساعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : "حفظ الملعب"}
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