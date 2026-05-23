import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/bookings/[id] - جلب تفاصيل حجز محدد
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('booking')
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف الحجز غير صالح' },
        { status: 400 }
      )
    }
    
    const booking = await db.collection('bookings').findOne({
      _id: new ObjectId(id)
    })
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'الحجز غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      booking: {
        ...booking,
        _id: booking._id.toString()
      }
    })
    
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب بيانات الحجز' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookings/[id] - إلغاء حجز
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    const client = await clientPromise
    const db = client.db('booking')
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف الحجز غير صالح' },
        { status: 400 }
      )
    }
    
    // جلب بيانات الحجز
    const booking = await db.collection('bookings').findOne({
      _id: new ObjectId(id)
    })
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'الحجز غير موجود' },
        { status: 404 }
      )
    }
    
    // التحقق من أن الحجز ليس ملغى بالفعل
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'الحجز ملغي بالفعل' },
        { status: 400 }
      )
    }
    
    // جلب المستخدم للتحقق من الصلاحية
    const user = userId && ObjectId.isValid(userId)
      ? await db.collection('users').findOne({ _id: new ObjectId(userId) })
      : null
    
    // التحقق من سياسة الإلغاء للمستخدم العادي
    if (user?.role !== 'admin') {
      const bookingDate = new Date(booking.date)
      const [hours] = booking.startTime.split(':')
      bookingDate.setHours(parseInt(hours), 0, 0)
      const hoursDiff = (bookingDate.getTime() - Date.now()) / (1000 * 60 * 60)
      
      if (hoursDiff < 12) {
        return NextResponse.json(
          { success: false, error: 'لا يمكن إلغاء الحجز قبل أقل من 12 ساعة من موعد الحجز' },
          { status: 400 }
        )
      }
    }
    
    // ✅ 1. تحديث حالة الحجز إلى cancelled
    await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelledBy: user?.role === 'admin' ? 'admin' : 'user'
        } 
      }
    )
    
    // ✅ 2. إذا كان الحجز مرتبط بمباراة، نحذف المباراة أيضاً
    if (booking.matchId) {
      await db.collection('matches').updateOne(
        { _id: new ObjectId(booking.matchId) },
        { 
          $set: { 
            status: 'cancelled',
            cancelledAt: new Date()
          } 
        }
      )
      
      // ✅ 3. إشعار للاعبين بالمباراة الملغية
      const match = await db.collection('matches').findOne({
        _id: new ObjectId(booking.matchId)
      })
      
      if (match && match.players) {
        const notifications = match.players.map((player: any) => ({
          userId: player.userId,
          type: 'match_cancelled',
          title: 'تم إلغاء المباراة ❌',
          message: `تم إلغاء المباراة في ${booking.fieldName} يوم ${booking.date}`,
          relatedId: booking.matchId,
          read: false,
          createdAt: new Date()
        }))
        
        if (notifications.length > 0) {
          await db.collection('notifications').insertMany(notifications)
        }
      }
    }
    
    // ✅ 4. إشعار للمستخدم
    await db.collection('notifications').insertOne({
      userId: booking.userId,
      type: 'booking_cancelled',
      title: user?.role === 'admin' ? 'تم إلغاء حجزك بواسطة الإدارة' : 'تم إلغاء حجزك',
      message: `تم إلغاء ${booking.matchId ? 'المباراة' : 'الحجز'} في ${booking.fieldName} يوم ${new Date(booking.date).toLocaleDateString('ar-EG')}`,
      relatedId: id,
      read: false,
      createdAt: new Date()
    })
    
    return NextResponse.json({ 
      success: true, 
      message: booking.matchId ? 'تم إلغاء المباراة بنجاح' : 'تم إلغاء الحجز بنجاح'
    })
    
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إلغاء الحجز' },
      { status: 500 }
    )
  }
}