'use client'

import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import BookingCard from '@/components/booking/BookingCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import BookingTicket from '@/components/BookingTicket'

export default function MyBookingsPage() {
  const searchParams = useSearchParams()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserId(user._id || user.id)
      } catch (e) {
        console.error('Error parsing user')
      }
    }
  }, [])

  useEffect(() => {
    if (userId) {
      loadBookings()
    }
  }, [userId])

  async function loadBookings() {
    try {
      setLoading(true)
      setError('')
      const data = await api.getBookings(`userId=${userId}`)
      setBookings(data.bookings || [])
    } catch (err: any) {
      setError(err.message || 'حدث خطأ في جلب الحجوزات')
      toast.error(err.message || 'حدث خطأ في جلب الحجوزات')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelBooking(id: string) {
    if (!confirm('هل أنت متأكد من إلغاء الحجز؟')) return
    
    try {
      await api.cancelBooking(id)
      toast.success('تم إلغاء الحجز بنجاح')
      await loadBookings()
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ في إلغاء الحجز')
    }
  }

  const success = searchParams.get('success')

  const upcoming = bookings.filter((b: any) => b.status === 'confirmed')
  const past = bookings.filter((b: any) => ['completed', 'cancelled'].includes(b.status))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">حجوزاتي</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-lg">
          تم إنشاء الحجز بنجاح!
        </div>
      )}
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">القادمة ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">السابقة ({past.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcoming.length === 0 ? (
            <p className="text-center text-gray-500 py-12">لا توجد حجوزات قادمة</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((booking: any) => (
                <div key={booking._id} className="relative">
                  <BookingCard 
                    booking={{
                      id: booking._id,
                      fieldName: booking.fieldName,
                      fieldLocation: booking.fieldLocation,
                      date: new Date(booking.date).toLocaleDateString('ar-EG'),
                      startTime: booking.startTime,
                      endTime: booking.endTime,
                      status: booking.status,
                      playersNeeded: booking.playersNeeded,
                      playersJoined: booking.playersJoined,
                      canCancel: true,
                      canEdit: false
                    }}
                    onCancel={() => handleCancelBooking(booking._id)}
                  />
                  <div className="absolute left-2 top-2">
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          {past.length === 0 ? (
            <p className="text-center text-gray-500 py-12">لا توجد حجوزات سابقة</p>
          ) : (
            <div className="space-y-4">
              {past.map((booking: any) => (
                <BookingCard 
                  key={booking._id} 
                  booking={{
                    id: booking._id,
                    fieldName: booking.fieldName,
                    fieldLocation: booking.fieldLocation,
                    date: new Date(booking.date).toLocaleDateString('ar-EG'),
                    startTime: booking.startTime,
                    endTime: booking.endTime,
                    status: booking.status,
                    canCancel: false,
                    canEdit: false
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}