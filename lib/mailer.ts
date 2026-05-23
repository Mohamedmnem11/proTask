import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// ─────────────────────────────────────────────────────────────
// تأكيد الحجز
// ─────────────────────────────────────────────────────────────
interface BookingConfirmationParams {
  userEmail:     string
  userName:      string
  fieldName:     string
  fieldLocation: string
  date:          string
  startTime:     string
  endTime:       string
  duration:      number
  totalPrice:    number
  bookingId:     string
}

export async function sendBookingConfirmationEmail(p: BookingConfirmationParams) {
  if (!process.env.SMTP_USER) return

  const bookingUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${p.bookingId}`

  await transporter.sendMail({
    from:    `"ملاعب Football Booking" <${process.env.SMTP_USER}>`,
    to:      p.userEmail,
    subject: `✅ تم تأكيد حجزك – ${p.fieldName}`,
    html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; padding: 24px; direction: rtl; }
  .wrap { max-width: 600px; margin: 0 auto; }
  .card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
  .header { background: linear-gradient(135deg, #1a7a3e, #2ea855); padding: 36px 32px; text-align: center; }
  .header .icon { font-size: 48px; margin-bottom: 12px; }
  .header h1 { color: #fff; font-size: 24px; margin: 0; }
  .header p  { color: rgba(255,255,255,.8); margin: 8px 0 0; font-size: 14px; }
  .body { padding: 32px; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
  .row:last-child { border: none; }
  .label { color: #888; }
  .value { font-weight: 700; color: #1a1a1a; }
  .total-row { background: #f0fdf4; border-radius: 12px; padding: 14px 16px; margin: 20px 0; display: flex; justify-content: space-between; align-items: center; }
  .total-label { font-size: 15px; font-weight: 700; color: #1a7a3e; }
  .total-price { font-size: 28px; font-weight: 900; color: #1a7a3e; }
  .btn { display: block; background: linear-gradient(135deg, #1a7a3e, #2ea855); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 12px; text-align: center; font-size: 16px; font-weight: 700; margin: 24px 0 0; }
  .footer { padding: 20px 32px; background: #fafafa; text-align: center; color: #aaa; font-size: 12px; }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <div class="icon">✅</div>
      <h1>تم تأكيد الحجز!</h1>
      <p>مرحباً ${p.userName}، حجزك مؤكد ومنتظرك</p>
    </div>
    <div class="body">
      <div class="row"><span class="label">الملعب</span><span class="value">${p.fieldName}</span></div>
      <div class="row"><span class="label">الموقع</span><span class="value">📍 ${p.fieldLocation}</span></div>
      <div class="row"><span class="label">التاريخ</span><span class="value">📅 ${p.date}</span></div>
      <div class="row"><span class="label">الوقت</span><span class="value">⏰ ${p.startTime} – ${p.endTime}</span></div>
      <div class="row"><span class="label">المدة</span><span class="value">${p.duration} ساعة</span></div>
      <div class="total-row">
        <span class="total-label">الإجمالي المدفوع</span>
        <span class="total-price">${p.totalPrice} ج</span>
      </div>
      <a href="${bookingUrl}" class="btn">عرض تفاصيل الحجز ←</a>
    </div>
    <div class="footer">تم الإرسال تلقائياً من منصة ملاعب • رقم الحجز: ${p.bookingId.slice(-8).toUpperCase()}</div>
  </div>
</div>
</body>
</html>`,
  })
}

// ─────────────────────────────────────────────────────────────
// إلغاء الحجز
// ─────────────────────────────────────────────────────────────
interface BookingCancellationParams {
  userEmail:   string
  userName:    string
  fieldName:   string
  date:        string
  startTime:   string
  endTime:     string
  cancelledBy: 'user' | 'admin'
}

export async function sendBookingCancellationEmail(p: BookingCancellationParams) {
  if (!process.env.SMTP_USER || !p.userEmail) return

  const isAdmin = p.cancelledBy === 'admin'

  await transporter.sendMail({
    from:    `"ملاعب Football Booking" <${process.env.SMTP_USER}>`,
    to:      p.userEmail,
    subject: `❌ تم إلغاء حجزك – ${p.fieldName}`,
    html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 24px; direction: rtl; }
  .wrap { max-width: 600px; margin: 0 auto; }
  .card { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
  .header { background: linear-gradient(135deg, #555, #777); padding: 36px 32px; text-align: center; }
  .header h1 { color: #fff; font-size: 22px; }
  .header p  { color: rgba(255,255,255,.7); margin-top: 8px; font-size: 14px; }
  .body { padding: 32px; }
  .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
  .row:last-child { border: none; }
  .label { color: #888; }
  .value { font-weight: 700; }
  .notice { background: ${isAdmin ? '#fff3e0' : '#f9f9f9'}; border-radius: 12px; padding: 14px; margin: 20px 0; font-size: 13px; color: #555; line-height: 1.7; border-right: 4px solid ${isAdmin ? '#f0a500' : '#ddd'}; }
  .footer { padding: 20px 32px; background: #fafafa; text-align: center; color: #aaa; font-size: 12px; }
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    <div class="header">
      <h1>❌ ${isAdmin ? 'تم إلغاء حجزك بواسطة الإدارة' : 'تم إلغاء حجزك'}</h1>
      <p>مرحباً ${p.userName}</p>
    </div>
    <div class="body">
      <div class="row"><span class="label">الملعب</span><span class="value">${p.fieldName}</span></div>
      <div class="row"><span class="label">التاريخ</span><span class="value">${p.date}</span></div>
      <div class="row"><span class="label">الوقت</span><span class="value">${p.startTime} – ${p.endTime}</span></div>
      <div class="notice">
        ${isAdmin
          ? '⚠️ تم إلغاء هذا الحجز من قِبَل الإدارة. إذا كان لديك استفسار، يرجى التواصل معنا.'
          : '✅ تم إلغاء حجزك بنجاح. يمكنك حجز موعد آخر في أي وقت.'}
      </div>
    </div>
    <div class="footer">تم الإرسال تلقائياً من منصة ملاعب</div>
  </div>
</div>
</body>
</html>`,
  })
}

// ─────────────────────────────────────────────────────────────
// إشعارات المباريات (من الملف السابق - محتفظ بها هنا)
// ─────────────────────────────────────────────────────────────
interface JoinRequestEmailParams {
  creatorEmail:   string
  creatorName:    string
  requesterName:  string
  requesterPhone: string
  matchTitle:     string
  matchDate:      string
  matchId:        string
}

export async function sendJoinRequestEmail(p: JoinRequestEmailParams) {
  if (!process.env.SMTP_USER) return
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/matches/${p.matchId}/requests`
  await transporter.sendMail({
    from:    `"ملاعب Football Booking" <${process.env.SMTP_USER}>`,
    to:      p.creatorEmail,
    subject: `⚽ طلب انضمام جديد – ${p.matchTitle}`,
    html: `<div dir="rtl" style="font-family:Arial;padding:24px;max-width:500px;margin:auto">
      <h2>⚽ طلب انضمام جديد</h2>
      <p>مرحباً ${p.creatorName}،</p>
      <p><strong>${p.requesterName}</strong> (${p.requesterPhone}) طلب الانضمام لـ <strong>${p.matchTitle}</strong> في ${p.matchDate}</p>
      <a href="${url}" style="display:inline-block;margin-top:16px;background:#1a7a3e;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700">مراجعة الطلبات →</a>
    </div>`,
  })
}

interface AcceptEmailParams {
  playerEmail:   string
  playerName:    string
  creatorPhone:  string
  matchTitle:    string
  matchDate:     string
  matchLocation: string
  matchId:       string
}

export async function sendAcceptEmail(p: AcceptEmailParams) {
  if (!process.env.SMTP_USER || !p.playerEmail) return
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/matches/${p.matchId}`
  await transporter.sendMail({
    from:    `"ملاعب Football Booking" <${process.env.SMTP_USER}>`,
    to:      p.playerEmail,
    subject: `✅ تم قبولك في المباراة – ${p.matchTitle}`,
    html: `<div dir="rtl" style="font-family:Arial;padding:24px;max-width:500px;margin:auto">
      <h2>🎉 مبروك! تم قبولك</h2>
      <p>مرحباً ${p.playerName}، تم قبولك في <strong>${p.matchTitle}</strong></p>
      <p>📅 ${p.matchDate} &nbsp; 📍 ${p.matchLocation}</p>
      <p>📞 تواصل مع المنظم: <strong>${p.creatorPhone}</strong></p>
      <a href="${url}" style="display:inline-block;margin-top:16px;background:#1a7a3e;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700">عرض المباراة →</a>
    </div>`,
  })
}

export async function sendRejectEmail(p: { playerEmail: string; playerName: string; matchTitle: string; matchDate: string }) {
  if (!process.env.SMTP_USER || !p.playerEmail) return
  await transporter.sendMail({
    from:    `"ملاعب Football Booking" <${process.env.SMTP_USER}>`,
    to:      p.playerEmail,
    subject: `بخصوص طلب الانضمام – ${p.matchTitle}`,
    html: `<div dir="rtl" style="font-family:Arial;padding:24px;max-width:500px;margin:auto">
      <h2>بخصوص طلبك</h2>
      <p>مرحباً ${p.playerName}، للأسف لم يتم قبول طلبك لـ <strong>${p.matchTitle}</strong> في ${p.matchDate}.</p>
      <p>يمكنك تصفح مباريات أخرى والانضمام إليها.</p>
    </div>`,
  })
}