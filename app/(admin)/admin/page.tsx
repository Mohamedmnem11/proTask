'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  CalendarDays, 
  Trophy,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  UserPlus,
  CalendarCheck,
  DollarSign
} from "lucide-react"
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DashboardStats {
  users: {
    total: number
    active: number
    admins: number
    newThisMonth: number
  }
  fields: {
    total: number
    active: number
  }
  bookings: {
    total: number
    confirmed: number
    cancelled: number
    pending: number
    totalRevenue: number
  }
  matches: {
    total: number
    open: number
    full: number
    completed: number
  }
  recentBookings: any[]
  recentUsers: any[]
  recentMatches: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0, admins: 0, newThisMonth: 0 },
    fields: { total: 0, active: 0 },
    bookings: { total: 0, confirmed: 0, cancelled: 0, pending: 0, totalRevenue: 0 },
    matches: { total: 0, open: 0, full: 0, completed: 0 },
    recentBookings: [],
    recentUsers: [],
    recentMatches: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week')

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      setLoading(true)
      
      // جلب كل البيانات من APIs حقيقية
      const [usersRes, fieldsRes, bookingsRes, matchesRes] = await Promise.all([
        fetch('/api/admin/users').then(res => res.json()),
        fetch('/api/fields').then(res => res.json()),
        fetch('/api/bookings').then(res => res.json()),
        fetch('/api/matches').then(res => res.json())
      ])

      const users = usersRes.users || []
      const fields = fieldsRes.fields || []
      const bookings = bookingsRes.bookings || []
      const matches = matchesRes.matches || []

      // حساب إحصائيات المستخدمين
      const activeUsers = users.filter((u: any) => u.isActive !== false).length
      const admins = users.filter((u: any) => u.role === 'admin').length
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      const newUsers = users.filter((u: any) => new Date(u.createdAt) > oneMonthAgo).length

      // حساب إحصائيات الحجوزات
      const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed').length
      const cancelledBookings = bookings.filter((b: any) => b.status === 'cancelled').length
      const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length
      
      // حساب الإيرادات (لو في سعر)
      const totalRevenue = bookings
        .filter((b: any) => b.status === 'confirmed')
        .reduce((sum: number, b: any) => sum + (b.price || 0), 0)

      // حساب إحصائيات المباريات
      const openMatches = matches.filter((m: any) => m.status === 'open').length
      const fullMatches = matches.filter((m: any) => m.status === 'full').length
      const completedMatches = matches.filter((m: any) => m.status === 'completed').length

      setStats({
        users: {
          total: users.length,
          active: activeUsers,
          admins: admins,
          newThisMonth: newUsers
        },
        fields: {
          total: fields.length,
          active: fields.filter((f: any) => f.isActive !== false).length
        },
        bookings: {
          total: bookings.length,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          pending: pendingBookings,
          totalRevenue
        },
        matches: {
          total: matches.length,
          open: openMatches,
          full: fullMatches,
          completed: completedMatches
        },
        recentBookings: bookings.slice(0, 5),
        recentUsers: users.slice(0, 5),
        recentMatches: matches.slice(0, 5)
      })
      
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header with date */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500 mt-1">
            مرحباً بك في لوحة تحكم المشرف
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">اليوم</SelectItem>
              <SelectItem value="week">هذا الأسبوع</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="year">هذه السنة</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            آخر تحديث: {new Date().toLocaleDateString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Card */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">إجمالي المستخدمين</span>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {stats.users.active} نشط
                </span>
                <span className="flex items-center gap-1 text-purple-600">
                  <TrendingUp className="w-4 h-4" />
                  +{stats.users.newThisMonth} هذا الشهر
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fields Card */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">الملاعب</span>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{stats.fields.total}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {stats.fields.active} متاح
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Card */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">الحجوزات</span>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{stats.bookings.total}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {stats.bookings.confirmed}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <XCircle className="w-4 h-4" />
                  {stats.bookings.cancelled}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm text-gray-500">الإيرادات</span>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">
                {stats.bookings.totalRevenue.toLocaleString()} ج.م
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  إجمالي
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Matches Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              المباريات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">إجمالي المباريات</span>
                <span className="font-bold">{stats.matches.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">مفتوحة</span>
                <span className="font-bold text-green-600">{stats.matches.open}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">مكتملة العدد</span>
                <span className="font-bold text-amber-600">{stats.matches.full}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">منتهية</span>
                <span className="font-bold text-gray-600">{stats.matches.completed}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              حالة الحجوزات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">مؤكدة</span>
                <span className="font-bold text-green-600">{stats.bookings.confirmed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">معلقة</span>
                <span className="font-bold text-amber-600">{stats.bookings.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ملغية</span>
                <span className="font-bold text-red-600">{stats.bookings.cancelled}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/admin/fields/new">
                <Button variant="outline" className="w-full h-12 text-sm">
                  <MapPin className="w-4 h-4 ml-2" />
                  إضافة ملعب
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-12 text-sm">
                  <Users className="w-4 h-4 ml-2" />
                  إدارة المستخدمين
                </Button>
              </Link>
              <Link href="/admin/bookings">
                <Button variant="outline" className="w-full h-12 text-sm">
                  <CalendarDays className="w-4 h-4 ml-2" />
                  الحجوزات
                </Button>
              </Link>
              <Link href="/admin/matches">
                <Button variant="outline" className="w-full h-12 text-sm">
                  <Trophy className="w-4 h-4 ml-2" />
                  المباريات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>أحدث المستخدمين</span>
              <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">
                عرض الكل
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد مستخدمين جدد</p>
            ) : (
              <div className="space-y-4">
                {stats.recentUsers.map((user: any) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'مشرف' : 'مستخدم'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>أحدث الحجوزات</span>
              <Link href="/admin/bookings" className="text-sm text-blue-600 hover:underline">
                عرض الكل
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد حجوزات حديثة</p>
            ) : (
              <div className="space-y-4">
                {stats.recentBookings.map((booking: any) => (
                  <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex-1">
                      <p className="font-bold">{booking.fieldName}</p>
                      <p className="text-sm text-gray-600">
                        {booking.userName || 'مستخدم'}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{new Date(booking.date).toLocaleDateString('ar-EG')}</span>
                        <span>•</span>
                        <span>{booking.startTime}</span>
                      </div>
                    </div>
                    <Badge variant={
                      booking.status === 'confirmed' ? 'success' : 
                      booking.status === 'cancelled' ? 'destructive' : 
                      'secondary'
                    }>
                      {booking.status === 'confirmed' ? 'مؤكد' : 
                       booking.status === 'cancelled' ? 'ملغي' : 
                       'معلق'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>أحدث المباريات</span>
            <Link href="/admin/matches" className="text-sm text-blue-600 hover:underline">
              عرض الكل
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentMatches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد مباريات حديثة</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recentMatches.map((match: any) => (
                <div key={match._id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{match.fieldName}</h4>
                    <Badge variant={match.status === 'open' ? 'success' : 'secondary'}>
                      {match.status === 'open' ? 'مفتوحة' : 
                       match.status === 'full' ? 'مكتملة' : 'منتهية'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{match.creatorName}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays className="w-3 h-3" />
                    <span>{new Date(match.date).toLocaleDateString('ar-EG')}</span>
                    <Clock className="w-3 h-3 mr-2" />
                    <span>{match.startTime}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-bold text-blue-600">{match.players?.length || 0}</span>
                    <span className="text-gray-500">/{match.totalNeeded} لاعب</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}