// ─────────────────────────────────────────────
// booking-utils.ts  —  منطق الحجز المركزي
// ─────────────────────────────────────────────

export const FIELD_OPEN_HOUR  = 6   // 6 صباحاً
export const FIELD_CLOSE_HOUR = 24  // منتصف الليل
export const MAX_HOURS_USER   = 3   // أقصى حجز للمستخدم العادي

/**
 * هل الساعة دي ماضية؟
 * لو اليوم هو نفس اليوم المختار → أي ساعة <= الساعة الحالية = ماضية
 */
export function isSlotPast(hour: number, dateStr: string): boolean {
  const now     = new Date()
  const todayStr = now.toISOString().split('T')[0]
  if (dateStr !== todayStr) return false
  return hour <= now.getHours()  // الساعة الحالية وما قبلها مقفولة
}

/**
 * احسب كل الساعات المحجوزة من قائمة الحجوزات
 * مثال: حجز من 10:00 → 12:00 يعطي ["10:00", "11:00"]
 */
export function calcBookedSlots(
  bookings: { startTime: string; endTime: string; status: string }[]
): string[] {
  const booked = new Set<string>()
  bookings
    .filter(b => b.status !== 'cancelled')
    .forEach(b => {
      const startH = parseInt(b.startTime.split(':')[0])
      const endH   = parseInt(b.endTime.split(':')[0])
      for (let h = startH; h < endH; h++) {
        booked.add(`${h.toString().padStart(2, '0')}:00`)
      }
    })
  return Array.from(booked)
}

/**
 * هل فيه تعارض بين حجز جديد وحجوزات موجودة؟
 * يستخدم في الـ API server-side
 */
export function hasConflict(
  newStart: string,
  newEnd: string,
  existing: { startTime: string; endTime: string }[]
): { conflict: boolean; with?: { startTime: string; endTime: string } } {
  for (const b of existing) {
    // تعارض لو: الجديد يبدأ قبل ما الموجود ينتهي AND الجديد ينتهي بعد ما الموجود يبدأ
    if (newStart < b.endTime && newEnd > b.startTime) {
      return { conflict: true, with: b }
    }
  }
  return { conflict: false }
}

/**
 * بناء قائمة الـ slots من ساعة الفتح لساعة الإغلاق
 */
export interface SlotInfo {
  hour:      number
  time:      string   // "08:00"
  label:     string   // "8 ص"
  isPast:    boolean
  isBooked:  boolean
  available: boolean
}

export function buildSlots(dateStr: string, bookedSlots: string[]): SlotInfo[] {
  const slots: SlotInfo[] = []
  for (let h = FIELD_OPEN_HOUR; h < FIELD_CLOSE_HOUR; h++) {
    const time    = `${h.toString().padStart(2, '0')}:00`
    const isPast  = isSlotPast(h, dateStr)
    const isBooked = bookedSlots.includes(time)
    slots.push({
      hour:      h,
      time,
      label:     formatHour(h),
      isPast,
      isBooked,
      available: !isPast && !isBooked,
    })
  }
  return slots
}

function formatHour(h: number): string {
  if (h === 0)  return '12 ص'
  if (h < 12)   return `${h} ص`
  if (h === 12) return '12 م'
  return `${h - 12} م`
}