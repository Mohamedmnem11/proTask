import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/notifications - جلب إشعارات المستخدم
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم غير صالح' },
        { status: 400 }
      )
    }

    const notifications = await db.collection('notifications')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()

    // تحويل _id إلى string
    const responseNotifications = notifications.map(n => ({
      ...n,
      _id: n._id.toString(),
      relatedId: n.relatedId?.toString()
    }))

    // عدد الإشعارات غير المقروءة
    const unreadCount = notifications.filter(n => !n.read).length

    return NextResponse.json({
      success: true,
      notifications: responseNotifications,
      unreadCount
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب الإشعارات' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - إنشاء إشعار جديد
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    const { userId, type, title, message, relatedId } = body

    if (!userId || !type || !message) {
      return NextResponse.json(
        { success: false, error: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم غير صالح' },
        { status: 400 }
      )
    }

    const notification = {
      userId,
      type,
      title: title || 'إشعار جديد',
      message,
      relatedId: relatedId || null,
      read: false,
      createdAt: new Date()
    }

    const result = await db.collection('notifications').insertOne(notification)

    return NextResponse.json({
      success: true,
      notification: {
        ...notification,
        _id: result.insertedId.toString()
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إنشاء الإشعار' },
      { status: 500 }
    )
  }
}