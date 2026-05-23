import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    const user = await db.collection('users').findOne({ email })

    // ✅ حتى لو مش موجود قول "تم الإرسال" - أمان أكتر
    if (!user) {
      return NextResponse.json({ success: true })
    }

    // إنشاء الـ token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // ساعة واحدة

    await db.collection('users').updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiry } }
    )

 const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,  // false للـ port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false  // مهم لو على localhost
  }
})

    const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`

    await transporter.sendMail({
      from: `"كوره بوك" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'إعادة تعيين كلمة المرور - كوره بوك',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(to left, #2563eb, #16a34a); width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 30px;">
              ⚽
            </div>
            <h1 style="color: #1e293b; margin-top: 12px;">كوره بوك</h1>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; border: 1px solid #e2e8f0;">
            <h2 style="color: #1e293b; margin-bottom: 16px;">إعادة تعيين كلمة المرور</h2>
            <p style="color: #64748b; margin-bottom: 24px; line-height: 1.8;">
              مرحباً ${user.name || ''}،<br/>
              استقبلنا طلب إعادة تعيين كلمة المرور لحسابك. اضغط على الزر أدناه لإعادة التعيين.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                style="background: linear-gradient(to left, #2563eb, #16a34a);
                       color: white;
                       padding: 14px 32px;
                       border-radius: 8px;
                       text-decoration: none;
                       font-weight: bold;
                       font-size: 16px;
                       display: inline-block;">
                إعادة تعيين كلمة المرور
              </a>
            </div>

            <p style="color: #94a3b8; font-size: 14px; text-align: center;">
              ⏰ الرابط صالح لمدة ساعة واحدة فقط
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">
              لو مطلبتش إعادة التعيين، تجاهل هذا الإيميل بأمان
            </p>
          </div>

        </div>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ، حاول مرة أخرى' },
      { status: 500 }
    )
  }
}