import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import nodemailer from 'nodemailer'

// ══════════════════════════════════════════════════════════════
// GET /api/matches
// ══════════════════════════════════════════════════════════════
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const { searchParams } = new URL(request.url)

    const filter: any = {}
    const creatorId = searchParams.get('creatorId')
    const status    = searchParams.get('status')
    const fieldId   = searchParams.get('fieldId')

    if (creatorId) filter.creatorId = creatorId
    if (status)    filter.status    = status
    if (fieldId)   filter.fieldId   = fieldId

    const matches = await db.collection('matches')
      .find(filter)
      .sort({ date: 1, startTime: 1 })
      .toArray()

    const responseMatches = matches.map(match => {
      const obj: any = {
        ...match,
        _id:         match._id?.toString(),
        fieldId:     match.fieldId?.toString(),
        creatorId:   match.creatorId?.toString(),
        fromBooking: match.fromBooking || false,
      }
      obj.players = (match.players || []).map((p: any) => ({
        ...p, userId: p.userId?.toString()
      }))
      obj.pendingRequests = (match.pendingRequests || []).map((r: any) => ({
        ...r, userId: r.userId?.toString()
      }))
      return obj
    })

    return NextResponse.json({ success: true, matches: responseMatches })

  } catch (error) {
    console.error('❌ GET /api/matches:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب المباريات', details: error instanceof Error ? error.message : '' },
      { status: 500 }
    )
  }
}

// ══════════════════════════════════════════════════════════════
// POST /api/matches — إنشاء مباراة
// ══════════════════════════════════════════════════════════════
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db     = client.db('booking')
    const body   = await request.json()

    console.log('📢 Creating match:', body)

    // ── التحقق من الحقول المطلوبة ──────────────────────────
    const required = ['fieldId', 'creatorId', 'date', 'startTime', 'endTime', 'currentPlayers', 'totalNeeded']
    for (const f of required) {
      if (!body[f]) {
        return NextResponse.json({ success: false, error: `الحقل ${f} مطلوب` }, { status: 400 })
      }
    }

    if (!ObjectId.isValid(body.fieldId) || !ObjectId.isValid(body.creatorId)) {
      return NextResponse.json({ success: false, error: 'معرف غير صالح' }, { status: 400 })
    }

    // ── جلب المنشئ ──────────────────────────────────────────
    const creator = await db.collection('users').findOne({ _id: new ObjectId(body.creatorId) })
    if (!creator) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 })
    }

    // ── حساب المدة ──────────────────────────────────────────
    const duration = body.duration
      ? Number(body.duration)
      : calcHours(body.startTime, body.endTime)

    // ══════════════════════════════════════════════════════
    // ✅ فحص الحد الأسبوعي (3 ساعات) — Admin مستثنى
    // ══════════════════════════════════════════════════════
    if (creator.role !== 'admin') {
      const check = await weeklyLimitCheck(db, creator._id.toString(), body.date, duration)
      if (!check.allowed) {
        return NextResponse.json({ success: false, error: check.message }, { status: 400 })
      }
    }

    // ── فحص التعارض ────────────────────────────────────────
    const existingBooking = await db.collection('bookings').findOne({
      fieldId: body.fieldId, date: body.date, startTime: body.startTime, status: { $ne: 'cancelled' }
    })
    if (existingBooking) {
      return NextResponse.json({ success: false, error: 'هذا الوقت محجوز بالفعل' }, { status: 400 })
    }

    const existingMatch = await db.collection('matches').findOne({
      fieldId: body.fieldId, date: body.date, startTime: body.startTime, status: { $in: ['open', 'full'] }
    })
    if (existingMatch) {
      return NextResponse.json({ success: false, error: 'هناك مباراة أخرى في هذا الوقت' }, { status: 400 })
    }

    // ── جلب بيانات الملعب ──────────────────────────────────
    const field = await db.collection('fields').findOne({ _id: new ObjectId(body.fieldId) })
    if (!field) {
      return NextResponse.json({ success: false, error: 'الملعب غير موجود' }, { status: 404 })
    }

    // ── إنشاء المباراة ──────────────────────────────────────
    const newMatch = {
      fieldId:       body.fieldId,
      fieldName:     field.name,
      fieldLocation: field.location,
      date:          body.date,
      startTime:     body.startTime,
      endTime:       body.endTime,
      duration,
      creatorId:     body.creatorId,
      creatorName:   creator.name,
      creatorPhone:  creator.phone  || '',
      creatorEmail:  creator.email  || '',
      teamName:      body.teamName  || '',
      currentPlayers: Number(body.currentPlayers),
      totalNeeded:   Number(body.totalNeeded),
      level:         body.level    || 'متوسط',
      notes:         body.notes    || '',
      fromBooking:   body.fromBooking || false,
      status:        'open',
      players: [{
        userId:    body.creatorId,
        userName:  creator.name,
        userPhone: creator.phone || '',
        userEmail: creator.email || '',
        joinedAt:  new Date(),
      }],
      pendingRequests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const matchResult = await db.collection('matches').insertOne(newMatch)
    const matchId     = matchResult.insertedId.toString()

    // ── إنشاء الحجز المرتبط ─────────────────────────────────
    await db.collection('bookings').insertOne({
      fieldId:   body.fieldId,
      fieldName: field.name,
      userId:    body.creatorId,
      userName:  creator.name,
      userPhone: creator.phone || '',
      userEmail: creator.email || '',
      date:      body.date,
      startTime: body.startTime,
      endTime:   body.endTime,
      duration,
      type:      'match',
      matchId,
      status:    'confirmed',
      price:     field.pricePerHour || 0,
      createdAt: new Date(),
    })

    // ══════════════════════════════════════════════════════
    // ✅ إشعار لكل المستخدمين لو المباراة ناقصة لاعبين
    //    (totalNeeded > 1 يعني منشئها وحده غير كافي)
    // ══════════════════════════════════════════════════════
    const needsPlayers = Number(body.totalNeeded) > 1

    if (needsPlayers) {
      // جلب كل المستخدمين ما عدا المنشئ
      const allUsers = await db.collection('users')
        .find(
          { _id: { $ne: new ObjectId(body.creatorId) } },
          { projection: { _id: 1, email: 1, name: 1 } }
        ).toArray()

      if (allUsers.length > 0) {
        // ── إشعارات داخلية (bulk insert) ──────────────────
        await db.collection('notifications').insertMany(
          allUsers.map(u => ({
            userId:    u._id.toString(),
            type:      'new_match',
            title:     '⚽ مباراة جديدة تحتاجك!',
            message:   `${creator.name} أنشأ مباراة في ${field.name}`,
            subText:   `${body.date} — ${body.startTime} | ${field.location}`,
            matchId,
            relatedId: matchId,
            read:      false,
            createdAt: new Date(),
          }))
        )

        // ── إشعار للمنشئ نفسه (تأكيد) ──────────────────
        await db.collection('notifications').insertOne({
          userId:    body.creatorId,
          type:      'match_created',
          title:     '✅ تم إنشاء مباراتك بنجاح',
          message:   `تم إنشاء مباراة في ${field.name} يوم ${body.date} الساعة ${body.startTime}`,
          matchId,
          relatedId: matchId,
          read:      false,
          createdAt: new Date(),
        })

        // ── إيميلات (non-blocking) ─────────────────────
        broadcastMatchEmails(
          allUsers
  .filter((u: any) => u?.email && u?.name)
  .map((u: any) => ({ email: u.email, name: u.name }))
          ,{
            creatorName:   creator.name,
            fieldName:     field.name,
            fieldLocation: field.location || '',
            date:          body.date,
            startTime:     body.startTime,
            endTime:       body.endTime,
            level:         body.level || 'متوسط',
            totalNeeded:   Number(body.totalNeeded),
            matchId,
          }
        ).catch(err => console.error('Email broadcast error:', err))
      }
    } else {
      // حجز عادي مكتمل — إشعار للمنشئ فقط
      await db.collection('notifications').insertOne({
        userId:    body.creatorId,
        type:      'booking_confirmed',
        title:     '✅ تم تأكيد حجزك',
        message:   `تم تأكيد حجزك في ${field.name} يوم ${body.date}`,
        relatedId: matchId,
        read:      false,
        createdAt: new Date(),
      })
    }

    return NextResponse.json({
      success: true,
      message: needsPlayers
        ? 'تم إنشاء المباراة وإرسال إشعارات لجميع المستخدمين'
        : 'تم إنشاء المباراة والحجز بنجاح',
      matchId,
    }, { status: 201 })

  } catch (error) {
    console.error('❌ POST /api/matches:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إنشاء المباراة', details: error instanceof Error ? error.message : '' },
      { status: 500 }
    )
  }
}

// ══════════════════════════════════════════════════════════════
// Helpers
// ══════════════════════════════════════════════════════════════

/** حساب الساعات بدقة من startTime و endTime */
function calcHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  return ((eh * 60 + em) - (sh * 60 + sm)) / 60
}

/** فحص الحد الأسبوعي 3 ساعات */
async function weeklyLimitCheck(
  db: any,
  userId: string,
  bookingDate: string,
  newDuration: number
): Promise<{ allowed: boolean; message: string }> {

  // حساب نطاق الأسبوع بناءً على تاريخ الحجز المطلوب
  const target = new Date(bookingDate)
  const day    = target.getDay()
  const weekStart = new Date(target); weekStart.setDate(target.getDate() - day)
  const weekEnd   = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6)

  const ws = weekStart.toISOString().split('T')[0]
  const we = weekEnd.toISOString().split('T')[0]

  // جلب الحجوزات والمباريات بالتوازي
  const [bookings, matches] = await Promise.all([
    db.collection('bookings').find({
      userId, date: { $gte: ws, $lte: we }, status: { $ne: 'cancelled' }
    }).toArray(),
    db.collection('matches').find({
      creatorId: userId, date: { $gte: ws, $lte: we }, status: { $ne: 'cancelled' }
    }).toArray(),
  ])

  const usedHours =
    bookings.reduce((s: number, b: any) => s + (b.duration || calcHours(b.startTime, b.endTime)), 0) +
    matches.reduce( (s: number, m: any) => s + (m.duration || calcHours(m.startTime, m.endTime)), 0)

  const totalAfter = usedHours + newDuration

  console.log('📊 Weekly limit check:', { userId, ws, we, usedHours, newDuration, totalAfter })

  if (totalAfter > 3) {
    const remaining = Math.max(0, 3 - usedHours).toFixed(1)
    return {
      allowed: false,
      message:
        `⚠️ تجاوزت الحد الأسبوعي (3 ساعات)\n` +
        `• الساعات المستخدمة: ${usedHours.toFixed(1)} من 3\n` +
        `• المطلوب: ${newDuration} ساعة\n` +
        `• المتبقي: ${remaining} ساعة فقط`,
    }
  }

  return { allowed: true, message: '' }
}

/** إرسال إيميلات إشعار المباراة الجديدة */
async function broadcastMatchEmails(
  users: Array<{ email: string; name: string }>,
  match: {
    creatorName: string; fieldName: string; fieldLocation: string
    date: string; startTime: string; endTime: string
    level: string; totalNeeded: number; matchId: string
  }
) {
  if (!process.env.SMTP_USER) {
    console.log('ℹ️ SMTP not configured — skipping emails')
    return
  }

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  for (const user of users) {
    try {
      await transporter.sendMail({
        from:    `"كورة بوك ⚽" <${process.env.SMTP_USER}>`,
        to:      user.email,
        subject: `⚽ مباراة جديدة تحتاجك — ${match.fieldName}`,
        html: buildMatchEmailHTML({ ...match, userName: user.name, BASE_URL }),
      })
    } catch (err) {
      console.error(`Failed email to ${user.email}:`, err)
    }
  }
}

function buildMatchEmailHTML(p: {
  userName: string; creatorName: string; fieldName: string
  fieldLocation: string; date: string; startTime: string
  endTime: string; level: string; totalNeeded: number
  matchId: string; BASE_URL: string
}) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:24px;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;direction:rtl}
  .card{max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .hdr{background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:32px;text-align:center;color:#fff}
  .hdr-icon{font-size:44px;margin-bottom:10px}
  .hdr h1{margin:0;font-size:22px;font-weight:700}
  .hdr p{margin:8px 0 0;opacity:.85;font-size:14px}
  .body{padding:28px}
  .row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px}
  .row:last-child{border:none}
  .lbl{color:#94a3b8;font-size:13px}
  .val{font-weight:600;color:#0f172a}
  .badge{display:inline-block;background:#dbeafe;color:#1d4ed8;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:600}
  .cta{display:block;margin:20px 0 0;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;text-decoration:none;padding:14px;border-radius:12px;text-align:center;font-size:15px;font-weight:700;box-shadow:0 4px 14px rgba(22,163,74,.3)}
  .footer{background:#f8fafc;padding:16px;text-align:center;color:#94a3b8;font-size:12px}
</style></head>
<body>
<div class="card">
  <div class="hdr">
    <div class="hdr-icon">⚽</div>
    <h1>مباراة جديدة تحتاجك!</h1>
    <p>مرحباً ${p.userName}، هناك مباراة تنتظر لاعبين</p>
  </div>
  <div class="body">
    <div class="row"><span class="lbl">المنشئ</span><span class="val">${p.creatorName}</span></div>
    <div class="row"><span class="lbl">الملعب</span><span class="val">${p.fieldName}</span></div>
    <div class="row"><span class="lbl">الموقع</span><span class="val">📍 ${p.fieldLocation}</span></div>
    <div class="row"><span class="lbl">التاريخ</span><span class="val">📅 ${p.date}</span></div>
    <div class="row"><span class="lbl">الوقت</span><span class="val">⏰ ${p.startTime} – ${p.endTime}</span></div>
    <div class="row"><span class="lbl">المستوى</span><span class="badge">${p.level}</span></div>
    <div class="row"><span class="lbl">اللاعبون المطلوبون</span><span class="val" style="color:#ef4444">👥 ${p.totalNeeded} لاعب</span></div>
    <a href="${p.BASE_URL}/matches/${p.matchId}" class="cta">انضم الآن ←</a>
  </div>
  <div class="footer">كورة بوك — تم الإرسال تلقائياً · <a href="${p.BASE_URL}/settings/notifications" style="color:#94a3b8">إلغاء الاشتراك</a></div>
</div>
</body></html>`
}