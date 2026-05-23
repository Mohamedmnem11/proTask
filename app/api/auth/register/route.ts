import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    
    // التحقق من البيانات المطلوبة
    const requiredFields = ['name', 'email', 'password', 'phone']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `الحقل ${field} مطلوب` },
          { status: 400 }
        )
      }
    }
    
    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      )
    }
    
    // التحقق من قوة كلمة المرور
    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      )
    }
    
    // التحقق من رقم الهاتف
    const phoneRegex = /^01[0125][0-9]{8}$/
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { success: false, error: 'رقم الهاتف غير صحيح (يبدأ بـ 010/011/012/015)' },
        { status: 400 }
      )
    }
    
    // التحقق من عدم تكرار البريد الإلكتروني
    const existingEmail = await db.collection('users').findOne({
      email: body.email
    })
    
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      )
    }
    
    // التحقق من عدم تكرار رقم الهاتف
    const existingPhone = await db.collection('users').findOne({
      phone: body.phone
    })
    
    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: 'رقم الهاتف مستخدم بالفعل' },
        { status: 400 }
      )
    }
    
    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(body.password, salt)
    
    // إنشاء المستخدم الجديد
    const newUser = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
      role: 'user', // user, admin
      isActive: true,
      bookings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('users').insertOne(newUser)
    
    // جلب المستخدم بدون كلمة المرور
    const user = await db.collection('users').findOne(
      { _id: result.insertedId },
      { projection: { password: 0 } } // منع إرجاع كلمة المرور
    )
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم إنشاء الحساب بنجاح',
      user 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إنشاء الحساب' },
      { status: 500 }
    )
  }
}