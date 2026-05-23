import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// GET /api/admin/users - جلب كل المستخدمين
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    
    // جلب كل المستخدمين
    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    // جلب عدد حجوزات كل مستخدم
    const usersWithStats = await Promise.all(users.map(async (user) => {
      const bookingsCount = await db.collection('bookings').countDocuments({
        userId: user._id.toString(),
        status: { $ne: 'cancelled' }
      })
      
      const cancelledCount = await db.collection('bookings').countDocuments({
        userId: user._id.toString(),
        status: 'cancelled'
      })
      
      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'user',
        isActive: user.isActive !== false,
        createdAt: user.createdAt,
        bookingsCount,
        cancelledCount
      }
    }))
    
    return NextResponse.json({
      success: true,
      users: usersWithStats
    })
    
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب المستخدمين' },
      { status: 500 }
    )
  }
}