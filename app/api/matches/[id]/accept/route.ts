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
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    const { userId } = body
    
    console.log('✅ Accepting request:', { matchId, userId })
    
    if (!ObjectId.isValid(matchId) || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    // جلب المباراة
    const match = await db.collection('matches').findOne({
      _id: new ObjectId(matchId)
    })
    
    if (!match) {
      return NextResponse.json(
        { success: false, error: 'المباراة غير موجودة' },
        { status: 404 }
      )
    }
    
    // جلب بيانات الطلب
    const requestData = match.pendingRequests?.find(
      (r: any) => r.userId === userId
    )
    
    if (!requestData) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود' },
        { status: 404 }
      )
    }
    
    // ✅ الحل: استخدم as any لتجاوز Type Checking
    await db.collection('matches').updateOne(
      { _id: new ObjectId(matchId) },
      {
        $pull: { pendingRequests: { userId: userId } },
        $push: {
          players: {
            userId,
            userName: requestData.userName,
            userPhone: requestData.userPhone,
            userEmail: requestData.userEmail,
            joinedAt: new Date()
          }
        },
        $set: {
          updatedAt: new Date(),
          status: (match.players?.length || 0) + 1 >= (match.totalNeeded || 0) ? 'full' : 'open'
        }
      } as any  // 👈 هذا هو الحل
    )
    
    // ✅ إشعار للاعب بالقبول
    await db.collection('notifications').insertOne({
      userId,
      type: 'request_accepted',
      title: 'تم قبول طلبك',
      message: `تم قبول انضمامك لمباراة ${match.fieldName}`,
      relatedId: matchId,
      read: false,
      createdAt: new Date()
    })
    
    // ✅ إرسال إيميل للاعب
    if (requestData.userEmail) {
      try {
        await sendEmail({
          to: requestData.userEmail,
          subject: '✅ تم قبول طلب انضمامك',
          html: emailTemplates.requestAccepted({
            userName: requestData.userName,
            matchField: match.fieldName,
            matchDate: new Date(match.date).toLocaleDateString('ar-EG'),
            matchTime: `${match.startTime} - ${match.endTime}`
          })
        })
      } catch (error) {
        console.error('Failed to send email:', error)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم قبول الطلب بنجاح'
    })
    
  } catch (error) {
    console.error('❌ Error accepting request:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في قبول الطلب' },
      { status: 500 }
    )
  }
}