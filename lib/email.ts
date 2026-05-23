// lib/email.ts
import nodemailer from 'nodemailer'

// إعدادات الإيميل (استخدم Gmail أو أي خدمة)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // بريدك الإلكتروني
    pass: process.env.EMAIL_PASS  // كلمة مرور التطبيق (App Password)
  }
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"نظام حجز الملاعب" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })
    
    console.log('✅ Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return { success: false, error }
  }
}

// قوالب الإيميلات
export const emailTemplates = {
  joinRequest: (data: { requesterName: string, matchField: string, matchDate: string, matchTime: string, matchId: string }) => `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #2563eb;">🔔 طلب انضمام جديد</h2>
      <p>مرحباً،</p>
      <p>هناك طلب انضمام جديد لمباراتك:</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>اللاعب:</strong> ${data.requesterName}</p>
        <p><strong>الملعب:</strong> ${data.matchField}</p>
        <p><strong>التاريخ:</strong> ${data.matchDate}</p>
        <p><strong>الوقت:</strong> ${data.matchTime}</p>
      </div>
      
      <p>لقبول أو رفض الطلب، يرجى زيارة الرابط التالي:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches/${data.matchId}/requests" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
        عرض الطلبات
      </a>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">نظام حجز الملاعب</p>
    </div>
  `,
  
  requestAccepted: (data: { userName: string, matchField: string, matchDate: string, matchTime: string }) => `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #16a34a;">✅ تم قبول طلبك</h2>
      <p>مرحباً ${data.userName}،</p>
      <p>تم قبول طلب انضمامك للمباراة:</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>الملعب:</strong> ${data.matchField}</p>
        <p><strong>التاريخ:</strong> ${data.matchDate}</p>
        <p><strong>الوقت:</strong> ${data.matchTime}</p>
      </div>
      
      <p>نتمنى لك مباراة ممتعة! ⚽</p>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">نظام حجز الملاعب</p>
    </div>
  `,
  
  requestRejected: (data: { userName: string, matchField: string }) => `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #dc2626;">❌ تم رفض طلبك</h2>
      <p>مرحباً ${data.userName}،</p>
      <p>نأسف لإعلامك أنه تم رفض طلب انضمامك لمباراة ${data.matchField}.</p>
      <p>يمكنك البحث عن مباريات أخرى مناسبة.</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0;">
        عرض المباريات المتاحة
      </a>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">نظام حجز الملاعب</p>
    </div>
  `
}