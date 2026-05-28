import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db('booking')

    // جلب المستخدم من الجلسة
    const user = await db.collection('users').findOne({ 
      email: session.user?.email 
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // جلب الحجوزات المؤكدة للمستخدم
    const bookings = await db.collection('bookings')
      .find({ 
        userId: user._id.toString(),
        status: 'confirmed'
      })
      .sort({ date: -1 })
      .limit(20)
      .toArray()

    const responseBookings = bookings.map(booking => ({
      ...booking,
      _id: booking._id.toString(),
      fieldId: booking.fieldId?.toString(),
      userId: booking.userId?.toString()
    }))

    return NextResponse.json({
      success: true,
      bookings: responseBookings
    })

  } catch (error) {
    console.error('❌ Error fetching confirmed bookings:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب الحجوزات' },
      { status: 500 }
    )
  }
}