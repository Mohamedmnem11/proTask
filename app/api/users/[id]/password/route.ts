import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

// PUT /api/users/[id]/password - تغيير كلمة السر
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    const { currentPassword, newPassword } = body

    console.log('📢 Change password request for user:', id)

    // التحقق من صحة الـ ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم غير صالح' },
        { status: 400 }
      )
    }

    // التحقق من البيانات
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور الحالية والجديدة مطلوبتان' },
        { status: 400 }
      )
    }

    // التحقق من طول كلمة السر الجديدة
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // جلب المستخدم مع كلمة السر
    const user = await db.collection('users').findOne({
      _id: new ObjectId(id)
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // التحقق من كلمة السر الحالية
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور الحالية غير صحيحة' },
        { status: 400 }
      )
    }

    // تشفير كلمة السر الجديدة
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // تحديث كلمة السر
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    })

  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تغيير كلمة المرور' },
      { status: 500 }
    )
  }
}