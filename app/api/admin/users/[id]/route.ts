import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PATCH /api/admin/users/[id] - تحديث مستخدم
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { role, isActive } = body
    
    console.log('📝 Updating user:', { id, role, isActive })
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db('booking')
    
    const updateData: any = {}
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم تحديث المستخدم بنجاح'
    })
    
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث المستخدم' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - حذف مستخدم
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('🗑️ Deleting user:', id)
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db('booking')
    
    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    })
    
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في حذف المستخدم' },
      { status: 500 }
    )
  }
}

// GET /api/admin/users/[id] - جلب مستخدم محدد
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
    
    const user = await db.collection('users').findOne({
      _id: new ObjectId(id)
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }
    
    // جلب إحصائيات الحجوزات
    const bookingsCount = await db.collection('bookings').countDocuments({
      userId: id,
      status: { $ne: 'cancelled' }
    })
    
    const cancelledCount = await db.collection('bookings').countDocuments({
      userId: id,
      status: 'cancelled'
    })
    
    return NextResponse.json({
      success: true,
      user: {
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
    })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب المستخدم' },
      { status: 500 }
    )
  }
}