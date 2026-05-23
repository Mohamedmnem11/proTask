import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { sendEmail, emailTemplates } from '@/lib/email'
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const matchId = id
    
    const body = await request.json()
    const { userId } = body
    
    console.log('📢 Join request:', { matchId, userId })
    
    if (!matchId) {
      return NextResponse.json(
        { success: false, error: 'معرف المباراة مطلوب' },
        { status: 400 }
      )
    }
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      )
    }
    
    const client = await clientPromise
    const db = client.db('booking')
    
    // تحويل الـ IDs
    let matchObjectId
    try {
      matchObjectId = new ObjectId(matchId)
    } catch (err) {
      return NextResponse.json(
        { success: false, error: 'معرف المباراة غير صالح' },
        { status: 400 }
      )
    }
    
    let userObjectId
    try {
      userObjectId = new ObjectId(userId)
    } catch (err) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم غير صالح' },
        { status: 400 }
      )
    }
    
    // جلب المباراة
    const match = await db.collection('matches').findOne({
      _id: matchObjectId
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
    
    // جلب المستخدم
    const user = await db.collection('users').findOne({
      _id: userObjectId
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
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
    
    // إضافة طلب الانتظار
   // بعد إضافة طلب الانتظار
await db.collection('matches').updateOne(
  { _id: matchObjectId },
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

// ✅ إضافة إشعار للمنشئ - المهم هنا
await db.collection('notifications').insertOne({
  userId: match.creatorId,
  type: 'join_request',
  title: 'طلب انضمام جديد',
  message: `${user.name} يريد الانضمام إلى مباراتك في ${match.fieldName}`,
  relatedId: matchId,
  relatedUserId: userId, // 👈👈👈 هذا السطر مهم جداً
  read: false,
  createdAt: new Date()
})

  // ✅ إرسال إيميل للمنشئ
    if (match.creatorEmail) {
      try {
        await sendEmail({
          to: match.creatorEmail,
          subject: '🔔 طلب انضمام جديد لمباراتك',
          html: emailTemplates.joinRequest({
            requesterName: user.name,
            matchField: match.fieldName,
            matchDate: new Date(match.date).toLocaleDateString('ar-EG'),
            matchTime: `${match.startTime} - ${match.endTime}`,
            matchId: matchId
          })
        })
      } catch (error) {
        console.error('Failed to send email:', error)
        // مش مشكلة كبيرة لو فشل الإيميل، استمر
      }
    }
    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب الانضمام بنجاح'
    })
    
  } catch (error) {
    console.error('❌ Error in join request:', error)
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