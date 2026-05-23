'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  Filter,
  XCircle,
  CheckCircle,
  Loader2,
  Eye,
  Download,
  RefreshCw
} from "lucide-react"
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { api } from '@/services/api'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

interface Booking {
  _id: string
  fieldId: string
  fieldName: string
  fieldLocation: string
  userId: string
  userName: string
  userPhone?: string
  date: string
  startTime: string
  endTime: string
  duration: number
  price: number
  totalPrice: number
  status: 'confirmed' | 'cancelled' | 'completed'
  playersNeeded?: number
  playersJoined?: number
  notes?: string
  createdAt: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    today: 0,
    revenue: 0
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {
      setLoading(true)
      const data = await api.getBookings()
      const bookingsList = data.bookings || []
      setBookings(bookingsList)

      // حساب الإحصائيات
      const today = new Date().toISOString().split('T')[0]
      const stats = {
        total: bookingsList.length,
        confirmed: bookingsList.filter((b: Booking) => b.status === 'confirmed').length,
        cancelled: bookingsList.filter((b: Booking) => b.status === 'cancelled').length,
        completed: bookingsList.filter((b: Booking) => b.status === 'completed').length,
        today: bookingsList.filter((b: Booking) => b.date === today).length,
        revenue: bookingsList
          .filter((b: Booking) => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum: number, b: Booking) => sum + (b.totalPrice || 0), 0)
      }
      setStats(stats)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelBooking(id: string) {
    if (!confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) return

    try {
      await api.cancelBooking(id)
      await fetchBookings() // إعادة تحميل البيانات
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  // فلترة الحجوزات
  const filteredBookings = bookings.filter(booking => {
    // فلترة حسب البحث
    const matchesSearch =
      booking.fieldName?.includes(searchTerm) ||
      booking.userName?.includes(searchTerm) ||
      booking.fieldLocation?.includes(searchTerm)

    // فلترة حسب الحالة
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter

    // فلترة حسب التاريخ
    const today = new Date().toISOString().split('T')[0]
    const matchesDate = dateFilter === 'all' ? true :
      dateFilter === 'today' ? booking.date === today :
        dateFilter === 'upcoming' ? booking.date > today :
          dateFilter === 'past' ? booking.date < today : true

    return matchesSearch && matchesStatus && matchesDate
  })

  // تجميع الحجوزات حسب التاريخ
  const groupedBookings = filteredBookings.reduce((groups: any, booking) => {
    const date = booking.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(booking)
    return groups
  }, {})

  // ترتيب التواريخ
  const sortedDates = Object.keys(groupedBookings).sort().reverse()

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الحجوزات</h1>
        <Button variant="outline" onClick={fetchBookings}>
          <RefreshCw className="w-4 h-4 ml-2" />
          تحديث
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-xs text-gray-600">إجمالي الحجوزات</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            <p className="text-xs text-gray-600">مؤكدة</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.completed}</p>
            <p className="text-xs text-gray-600">منتهية</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-xs text-gray-600">ملغية</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.today}</p>
            <p className="text-xs text-gray-600">اليوم</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {stats.revenue.toLocaleString()} ج
            </p>
            <p className="text-xs text-gray-600">الإيرادات</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ابحث باسم الملعب أو المستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="confirmed">مؤكدة</SelectItem>
                <SelectItem value="completed">منتهية</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="التاريخ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل التواريخ</SelectItem>
                <SelectItem value="today">اليوم</SelectItem>
                <SelectItem value="upcoming">القادمة</SelectItem>
                <SelectItem value="past">السابقة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">لا توجد حجوزات</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <h2 className="text-lg font-bold mb-3">
                {new Date(date).toLocaleDateString('ar-EG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <div className="space-y-4">
                {groupedBookings[date].map((booking: Booking) => (
                  <Card key={booking._id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        {/* معلومات الحجز */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold">{booking.fieldName}</h3>
                                <Badge className={
                                  booking.status === 'confirmed' ? 'bg-green-600 text-white hover:bg-green-700' :
                                    booking.status === 'completed' ? 'bg-gray-500 text-white' : 'bg-red-600 text-white'
                                }>
                                  {booking.status === 'confirmed' && 'مؤكد'}
                                  {booking.status === 'completed' && 'منتهي'}
                                  {booking.status === 'cancelled' && 'ملغي'}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{booking.fieldLocation}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>{booking.startTime} - {booking.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <User className="w-4 h-4" />
                                  <span>{booking.userName}</span>
                                </div>
                                {booking.userPhone && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <span>📞 {booking.userPhone}</span>
                                  </div>
                                )}
                              </div>

                              {booking.notes && (
                                <p className="text-sm text-gray-500 mt-2">
                                  ملاحظات: {booking.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* السعر والإجراءات */}
                        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4">
                          <div className="text-center lg:text-left">
                            <p className="text-sm text-gray-600">السعر الإجمالي</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {booking.totalPrice} ج
                            </p>
                            <p className="text-xs text-gray-500">
                              ({booking.duration} {booking.duration === 1 ? 'ساعة' : 'ساعات'} × {booking.price} ج)
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Link href={`/admin/bookings/${booking._id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 ml-1" />
                                تفاصيل
                              </Button>
                            </Link>

                            {booking.status === 'confirmed' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                <XCircle className="w-4 h-4 ml-1" />
                                إلغاء
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* تصدير البيانات */}
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          تصدير التقرير
        </Button>
      </div>
    </div>
  )
}