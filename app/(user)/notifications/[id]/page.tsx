'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  Check, 
  X, 
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  ChevronRight,
  User,
  Phone,
  Mail
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function NotificationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const notificationId = params.id as string
  
  const [notification, setNotification] = useState<any>(null)
  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    
    const user = JSON.parse(userStr)
    setUserId(user._id || user.id)
    loadNotification()
  }, [])

  async function loadNotification() {
    try {
      setLoading(true)
      
      // جلب الإشعار
      const notifRes = await fetch(`/api/notifications/${notificationId}`)
      const notifData = await notifRes.json()

      
    
    console.log('📨 Full API Response:', notifData) // 🔥 شوف هنا
    console.log('📨 Notification object:', notifData.notification)
    console.log('📨 relatedUserId:', notifData.notification?.relatedUserId)
    console.log('📨 requester:', notifData.notification?.requester)
      
      if (!notifData.success) {
        throw new Error(notifData.error)
      }
      
      setNotification(notifData.notification)
      
      // لو الإشعار له علاقة بمباراة، جلب المباراة
      if (notifData.notification?.relatedId) {
        try {
          const matchRes = await fetch(`/api/matches/${notifData.notification.relatedId}`)
          
          if (matchRes.ok) {
            const matchData = await matchRes.json()
            if (matchData.success) {
              setMatch(matchData.match)
            }
          } else {
            console.log('Match not found or error:', matchRes.status)
          }
        } catch (matchErr) {
          console.log('Error fetching match:', matchErr)
        }
      }
      
      // تحديد الإشعار كمقروء
      try {
        await fetch(`/api/notifications/${notificationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true })
        })
      } catch (readErr) {
        console.log('Error marking as read:', readErr)
      }
      
    } catch (error) {
      console.error('Error loading notification:', error)
    } finally {
      setLoading(false)
    }
  }

 async function handleAccept() {
  if (!match || !notification) return
  
  setProcessing(true)
  try {
    // شوف القيم الموجودة
    console.log('🔍 Notification data:', {
      relatedUserId: notification.relatedUserId,
      requester: notification.requester,
      fullNotification: notification
    })
    
    // جرب أكتر من طريقة عشان تجيب userId
    const targetUserId = 
      notification.relatedUserId || 
      notification.requester?._id ||
      notification.requester?.id ||
      null
    
    console.log('🎯 Target userId:', targetUserId)
    
    if (!targetUserId) {
      alert('❌ لا يمكن تحديد المستخدم صاحب الطلب (البيانات: ' + JSON.stringify(notification) + ')')
      return
    }
    
    const response = await fetch(`/api/matches/${match._id}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: targetUserId })
    })
    
    const data = await response.json()
    if (data.success) {
      alert('✅ تم قبول الطلب بنجاح')
      router.push(`/matches/${match._id}/requests`)
    } else {
      alert(data.error || 'حدث خطأ')
    }
  } catch (error) {
    console.error('Error accepting request:', error)
    alert('❌ حدث خطأ في قبول الطلب')
  } finally {
    setProcessing(false)
  }
}


  async function handleReject() {
    if (!match || !notification) return
    
    setProcessing(true)
    try {
      // استخدم relatedUserId من الإشعار
      const targetUserId = notification.relatedUserId || notification.requester?._id
      
      if (!targetUserId) {
        alert('❌ لا يمكن تحديد المستخدم صاحب الطلب')
        return
      }
      
      console.log('Rejecting user:', targetUserId)
      
      const response = await fetch(`/api/matches/${match._id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId })
      })
      
      const data = await response.json()
      if (data.success) {
        alert('✅ تم رفض الطلب')
        router.push('/notifications')
      } else {
        alert(data.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('❌ حدث خطأ في رفض الطلب')
    } finally {
      setProcessing(false)
    }
  }

  // دالة الأيقونة حسب نوع الإشعار
  const getIcon = () => {
    switch(notification?.type) {
      case 'join_request':
        return <Users className="w-8 h-8 text-blue-600" />
      case 'accept':
        return <Check className="w-8 h-8 text-green-600" />
      case 'reject':
        return <X className="w-8 h-8 text-red-600" />
      case 'booking_reminder':
        return <Clock className="w-8 h-8 text-blue-600" />
      default:
        return <Bell className="w-8 h-8 text-gray-600" />
    }
  }

  // دالة العنوان حسب نوع الإشعار
  const getTitle = () => {
    switch(notification?.type) {
      case 'join_request': return 'طلب انضمام جديد'
      case 'accept': return 'تم قبول طلبك'
      case 'reject': return 'تم رفض طلبك'
      case 'booking_reminder': return 'تذكير بالحجز'
      default: return notification?.title || 'إشعار'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!notification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">الإشعار غير موجود</p>
            <Button className="mt-4" onClick={() => router.push('/notifications')}>
              العودة للإشعارات
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/notifications" className="hover:text-blue-600">الإشعارات</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">تفاصيل الإشعار</span>
      </div>

      {/* Notification Details */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 border-b pb-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            {getIcon()}
          </div>
          <div className="flex-1">
            <CardTitle>{getTitle()}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(notification.createdAt).toLocaleString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <Badge variant={notification.read ? "secondary" : "destructive"}>
            {notification.read ? 'مقروء' : 'جديد'}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {/* Message */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{notification.message}</p>
          </div>

          {/* Match Details - اعرضها فقط لو المباراة موجودة */}
          {match && (
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                تفاصيل المباراة
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{match.fieldName} - {match.fieldLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(match.date).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{match.startTime} - {match.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{match.players?.length || 0}/{match.totalNeeded} لاعب</span>
                </div>
              </div>
            </div>
          )}

          {/* لو المباراة مش موجودة، اعرض رسالة */}
          {!match && notification?.relatedId && (
            <div className="border rounded-lg p-4 bg-yellow-50">
              <p className="text-yellow-700">
                المباراة المرتبطة بهذا الإشعار غير متاحة حالياً
              </p>
            </div>
          )}

          {/* Requester Info */}
          {notification.type === 'join_request' && notification.requester && (
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                معلومات اللاعب
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{notification.requester.name}</span>
                </div>
                {notification.requester.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span dir="ltr">{notification.requester.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{notification.requester.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - لطلبات الانضمام بس */}
          {notification.type === 'join_request' && (
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={handleAccept}
                disabled={processing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                ) : (
                  <Check className="w-4 h-4 ml-2" />
                )}
                قبول الطلب
              </Button>
              <Button 
                onClick={handleReject}
                disabled={processing}
                variant="outline"
                className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                ) : (
                  <X className="w-4 h-4 ml-2" />
                )}
                رفض الطلب
              </Button>
            </div>
          )}

          {/* View Match Button - للأنواع التانية */}
          {notification.type !== 'join_request' && match && (
            <div className="pt-4 border-t">
              <Link href={`/matches/${match._id}`}>
                <Button className="w-full">
                  عرض المباراة
                </Button>
              </Link>
            </div>
          )}

          {/* Back Button */}
          <div className="pt-2">
            <Button variant="ghost" onClick={() => router.back()} className="w-full">
              العودة
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}