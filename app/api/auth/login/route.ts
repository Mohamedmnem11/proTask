import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    
    // التحقق من البيانات
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }
    
    // البحث عن المستخدم
    const user = await db.collection('users').findOne({
      email: body.email
    })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }
    
    // التحقق من كلمة المرور
    const isValidPassword = await bcrypt.compare(body.password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }
    
    // التحقق من أن الحساب نشط
  // التحقق من أن الحساب نشط (إذا كان الحقل موجوداً وقيمته false فقط)
if (user.isActive === false) {
  return NextResponse.json(
    { success: false, error: 'هذا الحساب معطل' },
    { status: 403 }
  )
}
    
    // إزالة كلمة المرور من البيانات المرتجعة
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم تسجيل الدخول بنجاح',
      user: userWithoutPassword
    })
    
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    )
  }
}