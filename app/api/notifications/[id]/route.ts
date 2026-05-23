import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/notifications/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db('booking')
    
    const notification = await db.collection('notifications').findOne({
      _id: new ObjectId(id)
    })
    
    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'الإشعار غير موجود' },
        { status: 404 }
      )
    }
    
    // جلب بيانات اللاعب إذا كان الإشعار من نوع join_request
    let requester = null
    if (notification.type === 'join_request' && notification.relatedUserId) {
      requester = await db.collection('users').findOne(
        { _id: new ObjectId(notification.relatedUserId) },
        { projection: { name: 1, phone: 1, email: 1 } }
      )
    }
    
    return NextResponse.json({
      success: true,
      notification: {
        ...notification,
        _id: notification._id.toString(),
        relatedId: notification.relatedId?.toString(),
        relatedUserId: notification.relatedUserId?.toString(),
        requester: requester ? {
          name: requester.name,
          phone: requester.phone || '',
          email: requester.email,
          _id: requester._id.toString()
        } : null
      }
    })
    
  } catch (error) {
    console.error('Error fetching notification:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب الإشعار' },
      { status: 500 }
    )
  }
}

// PUT /api/notifications/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { read } = body
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db('booking')
    
    const result = await db.collection('notifications').updateOne(
      { _id: new ObjectId(id) },
      { $set: { read: read ?? true } }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'الإشعار غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم تحديث الإشعار'
    })
    
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث الإشعار' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db('booking')
    
    const result = await db.collection('notifications').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'الإشعار غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم حذف الإشعار'
    })
    
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في حذف الإشعار' },
      { status: 500 }
    )
  }
}