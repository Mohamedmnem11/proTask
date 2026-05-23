'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

interface DayInfo {
  date:           string
  dateObj:        Date
  dayName:        string
  dayNumber:      number
  monthName:      string
  isToday:        boolean
  isSelected:     boolean
  bookedSlots:    string[]   // "HH:00" – كل ساعة محجوزة
  availableCount: number
  isFullyBooked:  boolean
}

interface Booking {
  date:      string
  startTime: string
  endTime:   string
  status:    string
}

interface Props {
  fieldId:      string
  selectedDate: Date
  onDateSelect: (date: Date, bookedSlots: string[]) => void
}

const DAY_NAMES   = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
const MONTH_NAMES = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

// كل الـ 24 ساعة
const OPEN_HOUR  = 0
const CLOSE_HOUR = 24
const WORK_HOURS = CLOSE_HOUR - OPEN_HOUR  // 24

// ✅ حساب الساعات المحجوزة بشكل صحيح من startTime و endTime
function getBookedHoursFromRange(startTime: string, endTime: string): string[] {
  const startH = parseInt(startTime.split(':')[0])
  const endH   = parseInt(endTime.split(':')[0])
  const hours: string[] = []
  for (let h = startH; h < endH; h++) {
    hours.push(`${h.toString().padStart(2, '0')}:00`)
  }
  return hours
}

export default function AvailabilityCalendar({ fieldId, selectedDate, onDateSelect }: Props) {
  const [days, setDays]                       = useState<DayInfo[]>([])
  const [loading, setLoading]                 = useState(true)
  const [bookingsByDate, setBookingsByDate]   = useState<Record<string, string[]>>({})
  const [error, setError]                     = useState('')

  // ✅ دالة مساعدة: تاريخ محلي بدل UTC عشان ما يتبدلش اليوم مع بكره
  function toLocalDateStr(d: Date): string {
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-')
  }

  const fetchBookings = useCallback(async () => {
    if (!fieldId) return
    setLoading(true)
    setError('')

    try {
      const today   = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7)

      // ✅ استخدم التاريخ المحلي مش UTC
      const startStr = toLocalDateStr(today)
      const endStr   = toLocalDateStr(endDate)

      const res = await fetch(
        `/api/bookings?fieldId=${fieldId}&startDate=${startStr}&endDate=${endStr}`
      )
      if (!res.ok) throw new Error('فشل في جلب البيانات')

      const data     = await res.json()
      const bookings: Booking[] = data.bookings || []

      // ✅ تجميع الساعات المحجوزة بشكل صحيح
      const grouped: Record<string, string[]> = {}

      bookings
        .filter((b) => b.status !== 'cancelled')
        .forEach((b) => {
          if (!grouped[b.date]) grouped[b.date] = []
          const hours = getBookedHoursFromRange(b.startTime, b.endTime)
          hours.forEach((h) => {
            if (!grouped[b.date].includes(h)) grouped[b.date].push(h)
          })
        })

      setBookingsByDate(grouped)
    } catch (err) {
      console.error(err)
      setError('حدث خطأ في جلب المواعيد')
    } finally {
      setLoading(false)
    }
  }, [fieldId])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  useEffect(() => { buildDays() }, [bookingsByDate, selectedDate])

  function buildDays() {
    const today       = new Date()
    today.setHours(0, 0, 0, 0)
    // ✅ استخدم التاريخ المحلي للمقارنة
    const selectedStr = toLocalDateStr(selectedDate)
    const result: DayInfo[] = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      // ✅ تاريخ محلي بدل ISO/UTC
      const dateStr    = toLocalDateStr(d)
      const bookedSlots = bookingsByDate[dateStr] || []

      // احسب متاح من ساعات العمل فقط
      const workSlots = Array.from({ length: WORK_HOURS }, (_, i) => {
        const h = OPEN_HOUR + i
        return `${h.toString().padStart(2, '0')}:00`
      })
      const bookedWorkSlots = bookedSlots.filter((s) => workSlots.includes(s))

      result.push({
        date:           dateStr,
        dateObj:        d,
        dayName:        DAY_NAMES[d.getDay()],
        dayNumber:      d.getDate(),
        monthName:      MONTH_NAMES[d.getMonth()],
        isToday:        i === 0,
        isSelected:     selectedStr === dateStr,
        bookedSlots:    bookedSlots,
        availableCount: WORK_HOURS - bookedWorkSlots.length,
        isFullyBooked:  bookedWorkSlots.length >= WORK_HOURS,
      })
    }

    setDays(result)
  }

  function handleClick(day: DayInfo) {
    if (day.isFullyBooked) return
    onDateSelect(day.dateObj, day.bookedSlots)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        <p className="text-sm text-gray-500">جاري تحميل المواعيد...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500 text-sm mb-2">{error}</p>
        <button onClick={fetchBookings} className="text-blue-600 text-sm underline">
          إعادة المحاولة
        </button>
      </div>
    )
  }

  const selectedDay = days.find((d) => d.isSelected)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-sm">اختر يوم الحجز</h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">7 أيام قادمة</span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div
            key={day.date}
            onClick={() => handleClick(day)}
            title={day.isFullyBooked ? 'مكتمل' : `${day.availableCount} ساعة متاحة`}
            className={cn(
              'relative border-2 rounded-xl p-1.5 text-center transition-all duration-200',
              day.isFullyBooked
                ? 'bg-red-50 border-red-300 cursor-not-allowed opacity-70'
                : day.isSelected
                  ? 'bg-blue-600 border-blue-600 shadow-lg scale-105 cursor-pointer'
                  : day.isToday
                    ? 'bg-white border-blue-400 cursor-pointer hover:shadow-md'
                    : 'bg-white border-green-200 cursor-pointer hover:border-green-400 hover:bg-green-50'
            )}
          >
            <p className={cn('text-[9px] font-medium mb-0.5',
              day.isSelected ? 'text-blue-200' : 'text-gray-400')}>
              {day.dayName.slice(0, 3)}
            </p>

            <p className={cn('text-lg font-black leading-none',
              day.isSelected    ? 'text-white'  :
              day.isFullyBooked ? 'text-red-400' :
              day.isToday       ? 'text-blue-600' : 'text-gray-800')}>
              {day.dayNumber}
            </p>

            <p className={cn('text-[9px] mt-0.5',
              day.isSelected ? 'text-blue-200' : 'text-gray-400')}>
              {day.monthName.slice(0, 3)}
            </p>

            {/* شريط الإشغال */}
            {!day.isFullyBooked && (
              <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1">
                <div
                  className={cn('h-1 rounded-full transition-all',
                    day.bookedSlots.length === 0 ? 'bg-green-400' :
                    day.bookedSlots.length < 6   ? 'bg-green-500' :
                    day.bookedSlots.length < 14  ? 'bg-amber-500' : 'bg-red-500'
                  )}
                  style={{ width: `${Math.min(100, (day.bookedSlots.length / WORK_HOURS) * 100)}%` }}
                />
              </div>
            )}

            <p className={cn('mt-1 text-[8px] font-bold',
              day.isFullyBooked ? 'text-red-500'  :
              day.isSelected    ? 'text-white'     : 'text-green-600')}>
              {day.isFullyBooked ? '✕ مكتمل' : `${day.availableCount} متاح`}
            </p>

            {day.isToday && !day.isSelected && (
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-sm font-bold text-blue-800 mb-1">
            {selectedDay.dayName} {selectedDay.dayNumber} {selectedDay.monthName}
            {selectedDay.isToday && (
              <span className="mr-2 text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                اليوم
              </span>
            )}
          </p>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1 text-green-700">
              <CheckCircle className="w-3 h-3" />
              {selectedDay.availableCount} ساعة متاحة
            </span>
            {selectedDay.bookedSlots.length > 0 && (
              <span className="flex items-center gap-1 text-red-600">
                <XCircle className="w-3 h-3" />
                {selectedDay.bookedSlots.length} محجوزة
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 text-xs text-gray-500 pt-1 border-t flex-wrap">
        {[
          { cls: 'bg-green-50 border-green-300',  label: 'متاح'   },
          { cls: 'bg-blue-600 border-blue-700',   label: 'مختار'  },
          { cls: 'bg-red-50 border-red-300',      label: 'مكتمل'  },
        ].map(({ cls, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={cn('w-3 h-3 border-2 rounded', cls)} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}