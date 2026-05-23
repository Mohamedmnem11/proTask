'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  Loader2,
  Calendar,
  Trophy,
  Clock,
  Trash2
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    
    try {
      const user = JSON.parse(userStr)
      setUserId(user._id || user.id)
    } catch (e) {
      router.push('/login')
    }
  }, [])

  useEffect(() => {
    if (userId) {
      loadNotifications()
    }
  }, [userId])

  async function loadNotifications() {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`)
      const data = await res.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      })
      
      if (res.ok) {
        await loadNotifications()
      } else {
        console.error('Failed to mark as read')
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  async function markAllAsRead() {
    try {
      // اعملها واحدة واحدة
      for (const notif of notifications.filter((n: any) => !n.read)) {
        await fetch(`/api/notifications/${(notif as any)._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true })
        })
      }
      await loadNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  async function deleteNotification(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الإشعار؟')) return
    
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        await loadNotifications()
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getIcon = (type: string) => {
    switch(type) {
      case 'accept': return <Check className="w-5 h-5 text-green-600" />
      case 'reject': return <X className="w-5 h-5 text-red-600" />
      case 'booking_reminder': return <Clock className="w-5 h-5 text-blue-600" />
      case 'join_request': return <Bell className="w-5 h-5 text-blue-600" />
      default: return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const filteredNotifications = notifications.filter((n: any) => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  const unreadCount = notifications.filter((n: any) => !n.read).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">الإشعارات</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-lg">
              {unreadCount} جديد
            </Badge>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 ml-2" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">الكل ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">غير مقروء ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">مقروء</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">لا توجد إشعارات</p>
            <p className="text-gray-400 mt-2">
              {filter === 'unread' ? 'ليس لديك إشعارات غير مقروءة' : 'سوف تظهر هنا الإشعارات الجديدة'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif: any) => (
            <div 
              key={notif._id} 
              onClick={() => router.push(`/notifications/${notif._id}`)}
              className={`cursor-pointer transition hover:shadow-md rounded-lg ${
                !notif.read ? 'bg-blue-50/50 border border-blue-200' : 'border'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{notif.title}</h3>
                        <p className="text-gray-700 mt-1">{notif.message}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(notif.createdAt).toLocaleString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {!notif.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notif._id)}
                            title="تحديد كمقروء"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notif._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Link to related item - من غير <a> داخل <a> */}
                    {notif.relatedId && (
                      <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                        <span 
                          onClick={() => router.push(
                            notif.type?.includes('match') 
                              ? `/matches/${notif.relatedId}` 
                              : `/bookings/${notif.relatedId}`
                          )}
                          className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          عرض التفاصيل
                          <Trophy className="w-3 h-3 mr-1" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}