// lib/notifications.ts
import nodemailer from 'nodemailer'

// إعداد البريد الإلكتروني
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// إرسال إيميل
export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!to) return
  
  try {
    await transporter.sendMail({
      from: `"كورة بوك" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })
    console.log(`✅ Email sent to ${to}`)
  } catch (error) {
    console.error('❌ Error sending email:', error)
  }
}

// إرسال SMS (اختياري - ممكن تستخدم Twilio)
export async function sendSMS({ to, message }: { to: string; message: string }) {
  if (!to) return
  
  // هنا هتضيف خدمة SMS زي Twilio
  console.log(`📱 SMS to ${to}: ${message}`)
}