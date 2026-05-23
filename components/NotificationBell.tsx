'use client'

import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Bell, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  relatedId: string
  read: boolean
  createdAt: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        console.log('👤 User from localStorage:', userData)
        setUser(userData)
      } catch (e) {
        console.error('Error parsing user:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (user && open) {
      fetchNotifications()
    }
  }, [user, open])

  async function fetchNotifications() {
    if (!user) {
      console.log('❌ No user found')
      return
    }

    const userId = user._id || user.id
    if (!userId) {
      console.log('❌ No userId found')
      return
    }

    console.log('📡 Fetching notifications for userId:', userId)
    setLoading(true)
    
    try {
      // 👈 مهم: نضيف userId كـ query parameter
      const data = await api.getNotifications(userId)
      console.log('✅ Notifications fetched:', data)
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('❌ Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  async function markAsRead(id: string) {
    try {
      await api.markAsRead(id)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  function getNotificationLink(notification: Notification) {
    switch (notification.type) {
      case 'join_request':
        return `/matches/${notification.relatedId}/requests`
      case 'request_accepted':
      case 'request_rejected':
        return `/matches/${notification.relatedId}`
      default:
        return '#'
    }
  }

  if (!user) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-bold">الإشعارات</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد إشعارات
            </div>
          ) : (
            notifications.map((notification) => (
              <Link
                key={notification._id}
                href={getNotificationLink(notification)}
                onClick={() => {
                  if (!notification.read) markAsRead(notification._id)
                  setOpen(false)
                }}
                className={`block p-4 border-b hover:bg-gray-50 transition ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString('ar-EG')}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}