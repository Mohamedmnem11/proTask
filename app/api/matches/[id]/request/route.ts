import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. التحقق من المصادقة
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح. يرجى تسجيل الدخول' },
        { status: 401 }
      )
    }

    // 2. جلب الـ id من params (باستخدام await)
    const { id } = await params

    // 3. التحقق من صحة الـ id
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرّف المباراة غير صالح' },
        { status: 400 }
      )
    }

    // 4. الاتصال بقاعدة البيانات
    const client = await clientPromise
    const db = client.db('booking')

    // 5. جلب بيانات المباراة
    const match = await db.collection('matches').findOne({
      _id: new ObjectId(id)
    })

    if (!match) {
      return NextResponse.json(
        { success: false, error: 'المباراة غير موجودة' },
        { status: 404 }
      )
    }

    // 6. جلب بيانات المستخدم
    const user = await db.collection('users').findOne({
      email: session.user.email
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // 7. التحقق من عدم وجود طلب مسبق
    const existingRequest = await db.collection('requests').findOne({
      matchId: id,
      userId: user._id.toString(),
      status: { $in: ['pending', 'approved'] }
    })

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: 'لديك طلب سابق لهذه المباراة لا يزال قيد المعالجة' },
        { status: 400 }
      )
    }

    // 8. إنشاء طلب جديد
    const newRequest = {
      matchId: id,
      userId: user._id.toString(),
      userName: user.name,
      userEmail: user.email,
      matchTitle: match.title,
      matchDate: match.date,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('requests').insertOne(newRequest)

    // 9. إرجاع النتيجة
    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب الانضمام بنجاح',
      requestId: result.insertedId.toString(),
      request: {
        ...newRequest,
        _id: result.insertedId.toString()
      }
    })

  } catch (error) {
    console.error('❌ Error in match request API:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ داخلي في الخادم. يرجى المحاولة مرة أخرى لاحقاً' 
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      )
    }

    const { id } = await params

    const client = await clientPromise
    const db = client.db('booking')

    // جلب جميع طلبات هذه المباراة
    const requests = await db.collection('requests')
      .find({ matchId: id })
      .sort({ createdAt: -1 })
      .toArray()

    const formattedRequests = requests.map(req => ({
      ...req,
      _id: req._id.toString()
    }))

    return NextResponse.json({
      success: true,
      requests: formattedRequests
    })

  } catch (error) {
    console.error('❌ Error fetching requests:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب الطلبات' },
      { status: 500 }
    )
  }
}