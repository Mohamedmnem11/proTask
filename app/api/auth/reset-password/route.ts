import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'البيانات ناقصة' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }

    // البحث عن المستخدم بالـ token وتأكد إنه لسه صالح
    const user = await db.collection('users').findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // التوكن لسه مش منتهي
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'الرابط منتهي أو غير صحيح. اطلب رابط جديد.' },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await bcrypt.hash(password, 10)

    // تحديث كلمة المرور ومسح الـ token
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: '', resetTokenExpiry: '' } // مسح الـ token بعد الاستخدام
      }
    )

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ، حاول مرة أخرى' },
      { status: 500 }
    )
  }
}