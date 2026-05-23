'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Calendar, Clock, MapPin, Users, ChevronRight, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import TimeSlotPicker from '@/components/booking/TimeSlotPicker'
import { cn } from '@/lib/utils'
import AvailabilityCalendar from '@/components/booking/AvailabilityCalendar'
import toast from 'react-hot-toast'

// دوال مساعدة للتواريخ
function toLocalDateStr(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

export default function CreateMatchPage() {
  const router = useRouter()
  
  // States
  const [fields, setFields] = useState<any[]>([])
  const [selectedField, setSelectedField] = useState('')
  const [selectedFieldObj, setSelectedFieldObj] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDateStr, setSelectedDateStr] = useState('')
  const [selectedTime, setSelectedTime] = useState<{
    start: string;
    end: string;
    duration: number;
  } | null>(null)
  const [playersNeeded, setPlayersNeeded] = useState('8')
  const [level, setLevel] = useState('متوسط')
  const [notes, setNotes] = useState('')
  const [bookedSlotsForDay, setBookedSlotsForDay] = useState<string[]>([])
  
  // User and loading states
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [weeklyHours, setWeeklyHours] = useState({ booked: 0, remaining: 3 })

  // جلب بيانات المستخدم والملاعب عند التحميل
  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login?redirect=/matches/create')
      return
    }
    
    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
      loadFields()
      loadUserWeeklyHours(userData._id || userData.id)
    } catch (e) {
      router.push('/login')
    }
  }, [])

  // تحديث كائن الملعب المختار
  useEffect(() => {
    if (selectedField && fields.length > 0) {
      const field = fields.find(f => f._id === selectedField)
      setSelectedFieldObj(field)
    }
  }, [selectedField, fields])

  // جلب الملاعب
  async function loadFields() {
    try {
      const data = await api.getFields()
      setFields(data.fields || [])
    } catch (err) {
      console.error('Error loading fields:', err)
      setError('حدث خطأ في جلب الملاعب')
      toast.error('حدث خطأ في جلب الملاعب')
    } finally {
      setLoading(false)
    }
  }

  // جلب ساعات المستخدم هذا الأسبوع
  async function loadUserWeeklyHours(userId: string) {
    try {
      const data = await api.getUserWeeklyHours(userId)
      setWeeklyHours({
        booked: data.bookedHours || 0,
        remaining: data.remainingHours || 3
      })
    } catch (err) {
      console.error('Error loading weekly hours:', err)
    }
  }

  // معالج اختيار التاريخ
  function handleDateSelect(date: Date, bookedSlots: string[]) {
    setSelectedDate(date)
    setSelectedDateStr(toLocalDateStr(date))
    setBookedSlotsForDay(bookedSlots)
    setSelectedTime(null) // إعادة تعيين الوقت المختار
  }

  // معالج اختيار الوقت
  function handleTimeSelect(start: string, end: string, duration: number) {
    setSelectedTime({ start, end, duration })
  }

  // معالج تحديث الساعات المحجوزة
  function handleBookedSlotsUpdate(bookedSlots: string[]) {
    setBookedSlotsForDay(bookedSlots)
  }

  // إنشاء المباراة
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!user || !selectedField || !selectedDate || !selectedTime) {
      setError('يرجى إكمال جميع البيانات المطلوبة')
      toast.error('يرجى إكمال جميع البيانات المطلوبة')
      return
    }

    // التحقق من الساعات المتبقية
    if (selectedTime.duration > weeklyHours.remaining) {
      setError(`لا يمكنك تجاوز 3 ساعات في الأسبوع. المتبقي: ${weeklyHours.remaining} ساعات`)
      toast.error(`لا يمكنك تجاوز 3 ساعات في الأسبوع. المتبقي: ${weeklyHours.remaining} ساعات`)
      return
    }

    // التحقق من عدد اللاعبين (رقم صحيح)
    const playersNum = parseInt(playersNeeded)
    if (isNaN(playersNum) || playersNum < 2) {
      setError('عدد اللاعبين يجب أن يكون رقماً صحيحاً أكبر من 1')
      toast.error('عدد اللاعبين يجب أن يكون رقماً صحيحاً أكبر من 1')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const dateStr = toLocalDateStr(selectedDate)

      const match = {
        fieldId: selectedField,
        fieldName: selectedFieldObj?.name,
        creatorId: user._id || user.id,
        creatorName: user.name,
        date: dateStr,
        startTime: selectedTime.start,
        endTime: selectedTime.end,
        duration: selectedTime.duration,
        playersNeeded: playersNum,
        level: level,
        notes: notes,
        fromBooking: false
      }

      console.log('Creating match:', match)
      const response = await api.createMatch(match)
      
      if (response.success) {
        toast.success('تم إنشاء المباراة بنجاح!')
        router.push('/matches?success=true')
      } else {
        setError(response.error || 'حدث خطأ في إنشاء المباراة')
        toast.error(response.error || 'حدث خطأ في إنشاء المباراة')
      }
      
    } catch (err: any) {
      console.error('Error creating match:', err)
      setError(err.message || 'حدث خطأ في إنشاء المباراة')
      toast.error(err.message || 'حدث خطأ في إنشاء المباراة')
    } finally {
      setSubmitting(false)
    }
  }

  const isAdmin = user?.role === 'admin'
  const maxDuration = isAdmin ? 24 : 3

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/matches" className="hover:text-blue-600">المباريات</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">إنشاء مباراة</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">إنشاء مباراة جديدة</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Right Column - Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>ملخص المباراة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedFieldObj ? (
                  <>
                    <div>
                      <h3 className="font-bold mb-2">{selectedFieldObj.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedFieldObj.location}</span>
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{selectedDate.toLocaleDateString('ar-EG')}</span>
                      </div>
                    )}

                    {selectedTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{selectedTime.start} - {selectedTime.end} ({selectedTime.duration} ساعة)</span>
                      </div>
                    )}

                    {selectedTime && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{playersNeeded} لاعب</span>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600">الساعات المتبقية هذا الأسبوع:</p>
                      <p className={cn(
                        "text-2xl font-bold",
                        weeklyHours.remaining < 3 ? "text-orange-600" : "text-blue-600"
                      )}>
                        {weeklyHours.remaining}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">اختر ملعب لعرض الملخص</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Left Column - Form */}
          <div className="md:col-span-2 space-y-6">
            {/* Weekly Hours Progress */}
            {selectedField && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-blue-700 font-semibold">
                    الساعات المتبقية هذا الأسبوع:
                  </span>
                  <span className="text-lg font-bold text-blue-700">
                    {weeklyHours.remaining} / 3
                  </span>
                </div>
                
                <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${((3 - weeklyHours.remaining) / 3) * 100}%` }}
                  />
                </div>
                
                <p className="text-xs text-blue-600 mt-2">
                  🔄 سيتم تجديد الحصة يوم الأحد القادم
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Field Selection */}
            <Card>
              <CardHeader>
                <CardTitle>اختر الملعب</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الملعب" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field._id} value={field._id}>
                        {field.name} - {field.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Date Selection - باستخدام AvailabilityCalendar */}
            {selectedField && (
              <Card>
                <CardHeader>
                  <CardTitle>اختر التاريخ</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvailabilityCalendar
                    fieldId={selectedField}
                    selectedDate={selectedDate || new Date()}
                    onDateSelect={handleDateSelect}
                  />
                </CardContent>
              </Card>
            )}

            {/* Time Selection - باستخدام TimeSlotPicker */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle>اختر الوقت</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeSlotPicker
                    selectedDate={selectedDate}
                    fieldId={selectedField}
                    onSelectTime={handleTimeSelect}
                    maxDuration={maxDuration}
                    isAdmin={isAdmin}
                    onBookedSlotsUpdate={handleBookedSlotsUpdate}
                  />
                </CardContent>
              </Card>
            )}

            {/* Players Selection - Input بدل Select */}
            {selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle>عدد اللاعبين</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    type="number"
                    min="2"
                    max="50"
                    value={playersNeeded}
                    onChange={(e) => setPlayersNeeded(e.target.value)}
                    className="text-center text-lg"
                    placeholder="أدخل عدد اللاعبين"
                  />
                  <p className="text-sm text-gray-500">
                    * العدد الحالي في فريقك: 1 (أنت)
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Level Selection */}
            {selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle>مستوى اللعب</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المستوى" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مبتدئ">مبتدئ</SelectItem>
                      <SelectItem value="متوسط">متوسط</SelectItem>
                      <SelectItem value="متقدم">متقدم</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {selectedTime && (
              <Card>
                <CardHeader>
                  <CardTitle>ملاحظات (اختياري)</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="أي ملاحظات للاعبين (مثل: نحتاج حارس مرمى)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </CardContent>
              </Card>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12"
                onClick={() => router.back()}
              >
                رجوع
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                disabled={submitting || !selectedField || !selectedDate || !selectedTime}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الإنشاء...
                  </div>
                ) : (
                  'إنشاء مباراة'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}