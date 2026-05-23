'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Calendar, Clock, MapPin, User, ChevronRight, Download, Ticket } from 'lucide-react'
import toast from 'react-hot-toast'
import BookingTicket from '@/components/BookingTicket'

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    loadBooking()
  }, [])

  async function loadBooking() {
    try {
      setLoading(true)
      const data = await api.getBooking(bookingId)
      setBooking(data.booking)
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في جلب بيانات الحجز')
      toast.error('حدث خطأ في جلب بيانات الحجز')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) return
    
    setCancelling(true)
    try {
      await api.cancelBooking(bookingId)
      toast.success('تم إلغاء الحجز بنجاح')
      await loadBooking()
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ في إلغاء الحجز')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-red-600 mb-4">{error || 'الحجز غير موجود'}</p>
            <Button onClick={() => router.push('/my-bookings')}>
              العودة للحجوزات
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/my-bookings" className="hover:text-blue-600">حجوزاتي</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">تفاصيل الحجز</span>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>تفاصيل الحجز</CardTitle>
            <span className={`px-3 py-1 rounded-full text-sm ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {booking.status === 'confirmed' ? 'مؤكد' :
               booking.status === 'cancelled' ? 'ملغي' : 'معلق'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* تفاصيل الملعب */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">{booking.fieldName}</h3>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {booking.fieldLocation}
            </p>
          </div>

          {/* تفاصيل الوقت */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">التاريخ</p>
              <p className="font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                {new Date(booking.date).toLocaleDateString('ar-EG')}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">الوقت</p>
              <p className="font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                {booking.startTime} - {booking.endTime}
              </p>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="border-t pt-4">
            <h4 className="font-bold mb-3">معلومات إضافية</h4>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-600">مدة الحجز:</span>
                <span className="font-bold">{booking.duration} ساعات</span>
              </p>
              {booking.totalPlayers && (
                <p className="flex justify-between">
                  <span className="text-gray-600">عدد اللاعبين:</span>
                  <span className="font-bold">{booking.totalPlayers} لاعب</span>
                </p>
              )}
              <p className="flex justify-between">
                <span className="text-gray-600">السعر الإجمالي:</span>
                <span className="font-bold text-blue-600">{booking.totalPrice || booking.price * booking.duration} ج</span>
              </p>
            </div>
          </div>

          {/* ملاحظات */}
          {booking.notes && (
            <div className="border-t pt-4">
              <h4 className="font-bold mb-2">ملاحظات</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {booking.notes}
              </p>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex gap-3 pt-4 border-t">
            <BookingTicket 
              booking={{
                _id: booking._id,
                fieldName: booking.fieldName,
                fieldLocation: booking.fieldLocation,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                userName: booking.userName,
                totalPlayers: booking.totalPlayers,
                price: booking.price,
                duration: booking.duration
              }}
              type={booking.totalPlayers ? 'match' : 'booking'}
            />
            
            {booking.status === 'confirmed' && (
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                ) : null}
                إلغاء الحجز
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}