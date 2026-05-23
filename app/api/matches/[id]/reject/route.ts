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
    
    console.log('❌ Rejecting request:', { matchId, userId })
    
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
    
    // إزالة من قائمة الانتظار
    await db.collection('matches').updateOne(
      { _id: new ObjectId(matchId) },
      {
        $pull: { pendingRequests: { userId } },
        $set: { updatedAt: new Date() }
      }
    )
    
    // ✅ إشعار للاعب بالرفض
    await db.collection('notifications').insertOne({
      userId,
      type: 'request_rejected',
      title: 'تم رفض طلبك',
      message: `للأسف، تم رفض انضمامك لمباراة ${match.fieldName}`,
      relatedId: matchId,
      read: false,
      createdAt: new Date()
    })

     if (requestData.userEmail) {
      try {
        await sendEmail({
          to: requestData.userEmail,
          subject: '❌ تم رفض طلب انضمامك',
          html: emailTemplates.requestRejected({
            userName: requestData.userName,
            matchField: match.fieldName
          })
        })
      } catch (error) {
        console.error('Failed to send email:', error)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم رفض الطلب بنجاح'
    })
    
  } catch (error) {
    console.error('❌ Error rejecting request:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في رفض الطلب' },
      { status: 500 }
    )
  }
}