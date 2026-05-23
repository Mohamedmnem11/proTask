import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// POST /api/notifications/mark-all-read - تحديد كل الإشعارات كمقروءة
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    const { userId } = body

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم غير صالح' },
        { status: 400 }
      )
    }

    await db.collection('notifications').updateMany(
      { userId, read: false },
      { $set: { read: true } }
    )

    return NextResponse.json({
      success: true,
      message: 'تم تحديد الكل كمقروء'
    })

  } catch (error) {
    console.error('Error marking all as read:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث الإشعارات' },
      { status: 500 }
    )
  }
}