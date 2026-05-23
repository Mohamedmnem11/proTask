import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/users/[id] - جلب بيانات مستخدم
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
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } } // منع إرجاع كلمة السر
    )
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        ...user,
        _id: user._id.toString()
      }
    })
    
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب بيانات المستخدم' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - تحديث بيانات مستخدم
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    // الحقول المسموح بتحديثها
    const { name, phone } = body
    
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          name, 
          phone,
          updatedAt: new Date()
        } 
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم تحديث البيانات بنجاح'
    })
    
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث البيانات' },
      { status: 500 }
    )
  }
}