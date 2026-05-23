import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    const { userId, userName } = body
    
    console.log('📢 Request join:', { matchId: id, userId, userName })
    
    if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    // جلب المباراة
    const match = await db.collection('matches').findOne({
      _id: new ObjectId(id)
    })
    
    if (!match) {
      return NextResponse.json(
        { success: false, error: 'المباراة غير موجودة' },
        { status: 404 }
      )
    }
    
    // التحقق من حالة المباراة
    if (match.status !== 'open') {
      return NextResponse.json(
        { success: false, error: 'المباراة غير متاحة للانضمام' },
        { status: 400 }
      )
    }
    
    // التحقق من عدم وجود طلب سابق
    const alreadyRequested = match.pendingRequests?.some(
      (r: any) => r.userId === userId
    )
    
    if (alreadyRequested) {
      return NextResponse.json(
        { success: false, error: 'لديك طلب انتظار بالفعل' },
        { status: 400 }
      )
    }
    
    // التحقق من عدم الانضمام المسبق
    const alreadyJoined = match.players?.some(
      (p: any) => p.userId === userId
    )
    
    if (alreadyJoined) {
      return NextResponse.json(
        { success: false, error: 'أنت منضم بالفعل لهذه المباراة' },
        { status: 400 }
      )
    }
    
    // جلب بيانات المستخدم كاملة
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }
    
    // إضافة طلب الانتظار
    await db.collection('matches').updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          pendingRequests: {
            userId,
            userName: user.name,
            userPhone: user.phone || '',
            userEmail: user.email,
            requestedAt: new Date(),
            status: 'pending'
          }
        }
      }
    )
    
    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب الانضمام بنجاح'
    })
    
  } catch (error) {
    console.error('❌ Error in request join:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ في إرسال الطلب',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}