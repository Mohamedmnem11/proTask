'use client'

import { Button } from '@/components/ui/button'
import { Ticket } from 'lucide-react'
import toast from 'react-hot-toast'

interface BookingTicketProps {
  booking: {
    _id: string
    fieldName: string
    fieldLocation: string
    date: string
    startTime: string
    endTime: string
    userName: string
    userPhone?: string
    totalPlayers?: number
    price?: number
    duration?: number
    level?: string
  }
  type: 'booking' | 'match'
}

// ── QR pattern generator (no external lib needed) ────────────
function drawQR(ctx: CanvasRenderingContext2D, data: string, x: number, y: number, size: number) {
  const CELLS = 13
  const cell  = size / CELLS

  // White background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(x, y, size, size)

  // Generate deterministic bit matrix from data
  const seed = data.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 5381)
  const bits: boolean[][] = Array.from({ length: CELLS }, (_, r) =>
    Array.from({ length: CELLS }, (_, c) => Boolean((seed >> ((r * CELLS + c) % 32)) & 1))
  )

  // Finder patterns (top-left, top-right, bottom-left)
  const finders: [number, number][] = [[0, 0], [0, CELLS - 7], [CELLS - 7, 0]]
  finders.forEach(([fr, fc]) => {
    ctx.fillStyle = '#111827'
    ctx.fillRect(x + fc * cell, y + fr * cell, cell * 7, cell * 7)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x + (fc + 1) * cell, y + (fr + 1) * cell, cell * 5, cell * 5)
    ctx.fillStyle = '#111827'
    ctx.fillRect(x + (fc + 2) * cell, y + (fr + 2) * cell, cell * 3, cell * 3)
  })

  // Data modules (skip finder areas)
  ctx.fillStyle = '#111827'
  for (let r = 0; r < CELLS; r++) {
    for (let c = 0; c < CELLS; c++) {
      // skip finder zones
      if (r < 8 && c < 8)            continue
      if (r < 8 && c >= CELLS - 7)   continue
      if (r >= CELLS - 7 && c < 8)   continue
      if (bits[r][c]) {
        ctx.fillRect(x + c * cell + 0.5, y + r * cell + 0.5, cell - 1, cell - 1)
      }
    }
  }
}

// ── Draw RTL Arabic text ─────────────────────────────────────
function rtl(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW?: number) {
  ctx.save()
  ctx.direction  = 'rtl'
  ctx.textAlign  = 'right'
  maxW ? ctx.fillText(text, x, y, maxW) : ctx.fillText(text, x, y)
  ctx.restore()
}

// ── Rounded rectangle helper (fallback for older browsers) ──
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ── Convert canvas → PDF via jsPDF ──────────────────────────
async function savePDF(canvas: HTMLCanvasElement, filename: string) {
const { default: jsPDF } = await import('jspdf')
  const img = canvas.toDataURL('image/jpeg', 0.95)
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pw = pdf.internal.pageSize.getWidth()
  const ph = pdf.internal.pageSize.getHeight()
  pdf.addImage(img, 'JPEG', 0, 0, pw, ph)
  pdf.save(filename)
}

// ════════════════════════════════════════════════════════════
export default function BookingTicket({ booking, type }: BookingTicketProps) {

  const generate = async () => {
    try {
      const W = 1240     // A4 @ ~150dpi
      const H = 1754

      const canvas  = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!

      const ACCENT  = type === 'booking' ? '#2563eb' : '#16a34a'
      const ACCENT2 = type === 'booking' ? '#1d4ed8' : '#15803d'
      const CODE    = booking._id.slice(-8).toUpperCase()

      // ── 1. Background ──────────────────────────────────────
      ctx.fillStyle = '#f1f5f9'
      ctx.fillRect(0, 0, W, H)

      // subtle dot pattern
      ctx.fillStyle = 'rgba(0,0,0,0.03)'
      for (let rx = 0; rx < W; rx += 30)
        for (let ry = 0; ry < H; ry += 30) {
          ctx.beginPath(); ctx.arc(rx, ry, 1.5, 0, Math.PI * 2); ctx.fill()
        }

      // ── 2. Header ─────────────────────────────────────────
      const HH = 300
      const hg = ctx.createLinearGradient(0, 0, W, HH)
      hg.addColorStop(0,   '#0f172a')
      hg.addColorStop(0.6, '#1e293b')
      hg.addColorStop(1,   '#0f172a')
      ctx.fillStyle = hg
      ctx.fillRect(0, 0, W, HH)

      // decorative circles
      ctx.fillStyle = 'rgba(255,255,255,.05)'
      ctx.beginPath(); ctx.arc(W - 80, -40, 220, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(60,  HH + 20, 160, 0, Math.PI * 2); ctx.fill()

      // accent line bottom of header
      const ag = ctx.createLinearGradient(0, 0, W, 0)
      ag.addColorStop(0, 'transparent')
      ag.addColorStop(0.3, ACCENT)
      ag.addColorStop(0.7, ACCENT)
      ag.addColorStop(1, 'transparent')
      ctx.fillStyle = ag
      ctx.fillRect(0, HH - 5, W, 5)

      // ⚽ emoji
      ctx.font = '90px serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('⚽', W / 2, 105)

      // app name
      ctx.font = `bold 66px "Cairo", "Noto Sans Arabic", Arial`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText('كورة بوك', W / 2, 185)

      // ticket type
      ctx.font = `38px "Cairo", Arial`
      ctx.fillStyle = 'rgba(255,255,255,.65)'
      ctx.fillText(type === 'booking' ? 'تذكرة حجز ملعب' : 'تذكرة مباراة', W / 2, 245)

      // ── 3. Booking code pill ───────────────────────────────
      const pillY = HH + 28
      roundRect(ctx, W / 2 - 200, pillY, 400, 80, 40)
      ctx.fillStyle = ACCENT
      ctx.fill()
      ctx.font = 'bold 42px monospace'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText(`# ${CODE}`, W / 2, pillY + 52)

      // ── 4. Details card ────────────────────────────────────
      const CX = 55, CY = HH + 140, CW = W - 110
      const rows = [
        { icon: '🏟️', label: 'الملعب',       val: booking.fieldName },
        { icon: '📍', label: 'الموقع',       val: booking.fieldLocation || '—' },
        { icon: '📅', label: 'التاريخ',      val: new Date(booking.date).toLocaleDateString('ar-EG', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) },
        { icon: '⏰', label: 'الوقت',        val: `${booking.startTime} — ${booking.endTime}` },
        { icon: '👤', label: 'الاسم',        val: booking.userName },
        ...(booking.userPhone     ? [{ icon:'📞', label:'الهاتف',      val: booking.userPhone }]                            : []),
        ...(booking.duration      ? [{ icon:'⏱️', label:'المدة',       val: `${booking.duration} ساعة` }]                  : []),
        ...(booking.totalPlayers  ? [{ icon:'👥', label:'اللاعبون',    val: `${booking.totalPlayers} لاعب` }]               : []),
        ...(booking.level         ? [{ icon:'⭐', label:'المستوى',     val: booking.level }]                                : []),
        ...(booking.price         ? [{ icon:'💰', label:'الإجمالي',    val: `${booking.price * (booking.duration || 1)} جنيه` }] : []),
      ]
      const ROW_H  = 74
      const CARD_H = 32 + 52 + 16 + rows.length * ROW_H + 20

      // card shadow
      ctx.shadowColor = 'rgba(0,0,0,.12)'
      ctx.shadowBlur  = 40
      ctx.shadowOffsetY = 10
      roundRect(ctx, CX, CY, CW, CARD_H, 24)
      ctx.fillStyle = '#ffffff'
      ctx.fill()
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0

      // top accent bar
      roundRect(ctx, CX, CY, CW, 8, 24)
      ctx.fillStyle = ACCENT; ctx.fill()

      // card title
      ctx.font = `bold 42px "Cairo", Arial`
      ctx.fillStyle = '#0f172a'
      rtl(ctx, 'تفاصيل الحجز', CX + CW - 44, CY + 64)

      // divider
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(CX + 40, CY + 82); ctx.lineTo(CX + CW - 40, CY + 82)
      ctx.stroke()

      // rows
      let ry = CY + 100
      rows.forEach((row, i) => {
        if (i % 2 === 0) {
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(CX + 20, ry - 8, CW - 40, ROW_H - 8)
        }

        // icon
        ctx.font = '34px serif'
        ctx.textAlign = 'left'
        ctx.direction = 'ltr'
        ctx.fillStyle = '#000'
        ctx.fillText(row.icon, CX + 36, ry + 30)

        // label
        ctx.font = `bold 28px "Cairo", Arial`
        ctx.fillStyle = '#94a3b8'
        rtl(ctx, row.label + ':', CX + CW - 40, ry + 33)

        // value
        ctx.font = `32px "Cairo", Arial`
        ctx.fillStyle = '#1e293b'
        ctx.save()
        ctx.direction = 'rtl'; ctx.textAlign = 'right'
        ctx.fillText(row.val, CX + CW - 230, ry + 33, CW - 310)
        ctx.restore()

        ry += ROW_H
      })

      // ── 5. QR section ─────────────────────────────────────
      const QRY   = CY + CARD_H + 36
      const QRS   = 240
      const QCARD = QRS + 120

      ctx.shadowColor = 'rgba(0,0,0,.1)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6
      roundRect(ctx, W / 2 - QCARD / 2, QRY, QCARD, QRS + 100, 22)
      ctx.fillStyle = '#ffffff'; ctx.fill()
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0

      roundRect(ctx, W / 2 - QCARD / 2, QRY, QCARD, 8, 22)
      ctx.fillStyle = ACCENT; ctx.fill()

      ctx.font = `bold 32px "Cairo", Arial`
      ctx.fillStyle = '#0f172a'
      ctx.textAlign = 'center'
      ctx.direction = 'ltr'
      ctx.fillText('رمز التحقق', W / 2, QRY + 52)

      drawQR(ctx, booking._id, W / 2 - QRS / 2, QRY + 64, QRS)

      ctx.font = 'bold 28px monospace'
      ctx.fillStyle = '#64748b'
      ctx.textAlign = 'center'
      ctx.fillText(CODE, W / 2, QRY + QRS + 95)

      // ── 6. Perforation divider ─────────────────────────────
      const PERFY = QRY + QCARD + 48
      ctx.setLineDash([22, 16])
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(80, PERFY); ctx.lineTo(W - 80, PERFY)
      ctx.stroke()
      ctx.setLineDash([])
      // notch circles
      ;[[55, PERFY], [W - 55, PERFY]].forEach(([cx, cy]) => {
        ctx.fillStyle = '#f1f5f9'
        ctx.beginPath(); ctx.arc(cx, cy, 42, 0, Math.PI * 2); ctx.fill()
      })

      // ── 7. Terms ──────────────────────────────────────────
      const TY = PERFY + 54
      ctx.shadowColor = 'rgba(0,0,0,.07)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4
      roundRect(ctx, CX, TY, CW, 210, 20)
      ctx.fillStyle = '#ffffff'; ctx.fill()
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0

      ctx.font = `bold 32px "Cairo", Arial`
      ctx.fillStyle = '#334155'
      ctx.textAlign = 'center'
      ctx.direction = 'ltr'
      ctx.fillText('تعليمات مهمة', W / 2, TY + 54)

      const terms = [
        '● يجب الحضور قبل الموعد بـ ١٥ دقيقة',
        '● الإلغاء مجاني قبل ١٢ ساعة من الموعد',
        '● يُرجى إبراز هذه التذكرة عند الدخول للملعب',
      ]
      ctx.font = `28px "Cairo", Arial`
      ctx.fillStyle = '#64748b'
      terms.forEach((t, i) => {
        ctx.textAlign = 'center'
        ctx.direction = 'rtl'
        ctx.fillText(t, W / 2, TY + 100 + i * 44)
      })

      // ── 8. Footer ─────────────────────────────────────────
      const FY = H - 90
      const fg = ctx.createLinearGradient(0, FY, W, H)
      fg.addColorStop(0, '#0f172a'); fg.addColorStop(1, ACCENT2)
      ctx.fillStyle = fg
      ctx.fillRect(0, FY, W, 90)

      ctx.font = `28px "Cairo", Arial`
      ctx.fillStyle = 'rgba(255,255,255,.5)'
      ctx.textAlign = 'center'
      ctx.direction = 'ltr'
      ctx.fillText(`www.korabook.com  ·  ⚽  ·  ${new Date().getFullYear()} جميع الحقوق محفوظة`, W / 2, H - 35)

      // ── 9. Save as PDF ────────────────────────────────────
      await savePDF(canvas, `ticket-${CODE}.pdf`)
      toast.success('تم تحميل التذكرة بنجاح ✅')

    } catch (err) {
      console.error('Error generating PDF:', err)
      toast.error('حدث خطأ في تحميل التذكرة')
    }
  }

  return (
    <Button onClick={generate} variant="outline" size="sm" className="gap-2">
      <Ticket className="w-4 h-4" />
      تحميل التذكرة
    </Button>
  )
}