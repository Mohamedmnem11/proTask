import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// POST /api/teams/[id]/join - طلب انضمام لفريق
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    const { userId, position } = body
    
    if (!ObjectId.isValid(id) || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    
    // جلب الفريق
    const team = await db.collection('teams').findOne({
      _id: new ObjectId(id)
    })
    
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'الفريق غير موجود' },
        { status: 404 }
      )
    }
    
    // التحقق من عدم العضوية المسبقة
    const alreadyMember = team.members.some(
      (m: any) => m.userId === userId
    )
    
    if (alreadyMember) {
      return NextResponse.json(
        { success: false, error: 'أنت عضو بالفعل في هذا الفريق' },
        { status: 400 }
      )
    }
    
    // جلب بيانات المستخدم
    const user = await db.collection('users').findOne({
      _id: new ObjectId(userId)
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }
    
    // إضافة لقائمة الانتظار
    await db.collection('teams').updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          joinRequests: {
            userId,
            userName: user.name,
            position: position || 'لاعب',
            requestedAt: new Date()
          }
        }
      }as any
    )
    
    // إضافة إشعار للقائد
    await db.collection('notifications').insertOne({
      userId: team.captainId,
      type: 'team_join_request',
      title: 'طلب انضمام لفريقك',
      message: `${user.name} يريد الانضمام إلى فريق ${team.name}`,
      relatedId: id,
      read: false,
      createdAt: new Date()
    })
    
    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب الانضمام بنجاح'
    })
    
  } catch (error) {
    console.error('Error joining team:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في طلب الانضمام' },
      { status: 500 }
    )
  }
}