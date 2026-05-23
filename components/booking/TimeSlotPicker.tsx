'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Lock, CheckCircle, Clock, Loader2, ShieldCheck } from 'lucide-react'

interface Slot {
  time:       string
  hour:       number
  label:      string
  isBooked:   boolean
  isPast:     boolean
  isSelected: boolean
  isInRange:  boolean
  isEnd:      boolean
}

interface Props {
  selectedDate:         Date
  fieldId:              string
  onSelectTime:         (start: string, end: string, duration: number) => void
  maxDuration?:         number
  isAdmin?:             boolean   // ✅ الجديد — الأدمن ما يتقيدش
  externalBookedSlots?: string[]
  onBookedSlotsUpdate?: (slots: string[]) => void
}

const OPEN_HOUR  = 0
const CLOSE_HOUR = 24

function formatHour(h: number): string {
  if (h === 0)  return '12 ص'
  if (h < 12)   return `${h} ص`
  if (h === 12) return '12 م'
  return `${h - 12} م`
}

function toLocalDateStr(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

export default function TimeSlotPicker({
  selectedDate,
  fieldId,
  onSelectTime,
  maxDuration = 3,
  isAdmin = false,
  externalBookedSlots,
  onBookedSlotsUpdate,
}: Props) {
  const [bookedSlots,   setBookedSlots]   = useState<string[]>(externalBookedSlots ?? [])
  const [loadingSlots,  setLoadingSlots]  = useState(false)
  const [selectedStart, setSelectedStart] = useState<number | null>(null)
  const [selectedEnd,   setSelectedEnd]   = useState<number | null>(null)
  const [hovered,       setHovered]       = useState<number | null>(null)
  const [rangeError,    setRangeError]    = useState('')

  const dateStr     = toLocalDateStr(selectedDate)
  const prevDateRef = useRef(dateStr)

  // ── reset الاختيار لما اليوم يتغير
  useEffect(() => {
    if (prevDateRef.current !== dateStr) {
      prevDateRef.current = dateStr
      setSelectedStart(null)
      setSelectedEnd(null)
      setHovered(null)
      setRangeError('')
    }
  }, [dateStr])

  // ── externalBookedSlots له أولوية
  useEffect(() => {
    if (externalBookedSlots !== undefined) {
      setBookedSlots(externalBookedSlots)
      onBookedSlotsUpdate?.(externalBookedSlots)
    }
  }, [externalBookedSlots])

  // ── لو مفيش external، نجيب من API
  useEffect(() => {
    if (externalBookedSlots === undefined) {
      fetchDayBookings()
    }
  }, [dateStr]) // eslint-disable-line

  async function fetchDayBookings() {
    setLoadingSlots(true)
    try {
      const res  = await fetch(`/api/bookings?fieldId=${fieldId}&date=${dateStr}`)
      if (!res.ok) return
      const data = await res.json()

      const booked: string[] = []
      data.bookings
        ?.filter((b: { status: string }) => b.status !== 'cancelled')
        .forEach((b: { startTime: string; endTime: string }) => {
          const startH = parseInt(b.startTime.split(':')[0])
          const endH   = parseInt(b.endTime.split(':')[0])
          for (let h = startH; h < endH; h++) {
            const slot = `${h.toString().padStart(2, '0')}:00`
            if (!booked.includes(slot)) booked.push(slot)
          }
        })

      setBookedSlots(booked)
      onBookedSlotsUpdate?.(booked)
    } catch {
      // silent
    } finally {
      setLoadingSlots(false)
    }
  }

  // ── بناء الـ slots
  function buildSlots(): Slot[] {
    const now      = new Date()
    const todayStr = toLocalDateStr(now)
    const isToday  = dateStr === todayStr
    const nowHour  = now.getHours()

    return Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => {
      const hour = OPEN_HOUR + i
      const time = `${hour.toString().padStart(2, '0')}:00`

      // ✅ الأدمن ما يتقيدش بساعات اللي فاتت
      const isPast   = !isAdmin && isToday && hour <= nowHour
      const isBooked = bookedSlots.includes(time)

      let isSelected = false
      let isInRange  = false
      let isEnd      = false

      if (selectedStart !== null) {
        const endPoint = selectedEnd ?? hovered
        isSelected = hour === selectedStart
        if (endPoint !== null && endPoint > selectedStart) {
          isInRange = !isSelected && hour > selectedStart && hour < endPoint
          isEnd     = hour === endPoint && selectedEnd !== null
        }
      }

      return { time, hour, label: formatHour(hour), isBooked, isPast, isSelected, isInRange, isEnd }
    })
  }

  const slots = buildSlots()

  function handleSlotClick(slot: Slot) {
    if (slot.isPast) return
    // ✅ الأدمن يقدر يضغط على المحجوز — المستخدم العادي لا
    if (!isAdmin && slot.isBooked) return
    setRangeError('')

    if (selectedStart === null) {
      setSelectedStart(slot.hour)
      setSelectedEnd(null)
      return
    }

    if (slot.hour <= selectedStart) {
      setSelectedStart(slot.hour)
      setSelectedEnd(null)
      return
    }

    const duration = slot.hour - selectedStart

    // ✅ الأدمن ما يتقيدش بالحد الأقصى للساعات
    if (!isAdmin && duration > maxDuration) {
      setRangeError(`الحد الأقصى للحجز ${maxDuration} ساعات`)
      setSelectedStart(slot.hour)
      setSelectedEnd(null)
      return
    }

    // ✅ التحقق من الساعات المحجوزة داخل النطاق — للمستخدم العادي فقط
    if (!isAdmin) {
      for (let h = selectedStart; h < slot.hour; h++) {
        const t = `${h.toString().padStart(2, '0')}:00`
        if (bookedSlots.includes(t)) {
          setRangeError('يوجد وقت محجوز داخل هذا النطاق')
          setSelectedStart(slot.hour)
          setSelectedEnd(null)
          return
        }
      }
    }

    // ✅ تحقق من الساعات الماضية داخل النطاق — للمستخدم العادي فقط
    if (!isAdmin) {
      const now      = new Date()
      const todayStr = toLocalDateStr(now)
      const isToday  = dateStr === todayStr
      const nowHour  = now.getHours()

      for (let h = selectedStart; h < slot.hour; h++) {
        if (isToday && h <= nowHour) {
          setRangeError('يوجد وقت مضى داخل هذا النطاق')
          setSelectedStart(slot.hour)
          setSelectedEnd(null)
          return
        }
      }
    }

    setSelectedEnd(slot.hour)
    const startTime = `${selectedStart.toString().padStart(2, '0')}:00`
    const endTime   = `${slot.hour.toString().padStart(2, '0')}:00`
    onSelectTime(startTime, endTime, duration)
  }

  function getSlotClass(slot: Slot): string {
    if (slot.isPast)     return 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
    // ✅ الأدمن: المحجوز يظهر بلون تحذيري لكن قابل للضغط
    if (slot.isBooked && isAdmin)  return 'bg-orange-50 border-orange-300 text-orange-600 cursor-pointer hover:border-orange-500'
    if (slot.isBooked && !isAdmin) return 'bg-red-50 border-red-300 text-red-500 cursor-not-allowed'
    if (slot.isSelected) return 'bg-blue-600 border-blue-700 text-white shadow-md cursor-pointer ring-2 ring-blue-300'
    if (slot.isEnd)      return 'bg-blue-700 border-blue-800 text-white shadow-md cursor-pointer ring-2 ring-blue-400'
    if (slot.isInRange)  return 'bg-blue-100 border-blue-300 text-blue-700 cursor-pointer'
    return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-400 cursor-pointer'
  }

  const duration = selectedStart !== null && selectedEnd !== null
    ? selectedEnd - selectedStart
    : null

  if (loadingSlots) {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <p className="text-sm text-gray-500">جاري تحميل المواعيد...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* تعليمات */}
      <div className={cn(
        'rounded-xl p-3 text-xs',
        isAdmin ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'
      )}>
        {isAdmin ? (
          <p className="text-purple-700 flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            وضع الإدارة — يمكنك حجز أي عدد ساعات بما فيها الماضية
          </p>
        ) : (
          <>
            <p className="font-semibold mb-0.5 text-gray-600">كيفية الاختيار:</p>
            <p className="text-gray-400">
              اضغط ساعة البداية ← ثم اضغط ساعة النهاية (حد أقصى {maxDuration} ساعات)
            </p>
          </>
        )}
      </div>

      {/* شبكة الساعات */}
      <div className="grid grid-cols-4 gap-1.5 max-h-72 overflow-y-auto pl-1">
        {slots.map((slot) => (
          <div
            key={slot.time}
            onClick={() => handleSlotClick(slot)}
            onMouseEnter={() => {
              if (selectedStart !== null && selectedEnd === null && !slot.isPast &&
                  (!slot.isBooked || isAdmin)) {
                setHovered(slot.hour)
              }
            }}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'border-2 rounded-xl p-2 text-center transition-all duration-100 select-none',
              getSlotClass(slot)
            )}
          >
            <div className="flex items-center justify-center gap-0.5 mb-0.5">
              {slot.isBooked   && <Lock        className="w-2.5 h-2.5" />}
              {slot.isSelected && <CheckCircle className="w-2.5 h-2.5" />}
              <span className="text-xs font-bold">{slot.time}</span>
            </div>
            <p className="text-[9px] font-medium">
              {slot.isPast     ? 'مضى'                          :
               slot.isBooked && isAdmin  ? 'محجوز ⚠️'          :
               slot.isBooked   ? 'محجوز 🔒'                    :
               slot.isSelected ? 'بداية'                        :
               slot.isEnd      ? 'نهاية'                        :
               slot.isInRange  ? '●●●'                          :
               slot.label}
            </p>
          </div>
        ))}
      </div>

      {/* خطأ في النطاق */}
      {rangeError && (
        <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          ⚠️ {rangeError}
        </div>
      )}

      {/* ملخص الاختيار */}
      {selectedStart !== null && (
        <div className={cn(
          'rounded-xl p-4 border-2',
          selectedEnd !== null ? 'bg-blue-50 border-blue-300' : 'bg-amber-50 border-amber-300'
        )}>
          {selectedEnd !== null ? (
            <>
              <p className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4" />
                تم اختيار الموعد
              </p>
              <div className="grid grid-cols-3 gap-2 text-sm text-center">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">من</p>
                  <p className="font-black text-blue-700 text-base">
                    {selectedStart.toString().padStart(2, '0')}:00
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">إلى</p>
                  <p className="font-black text-blue-700 text-base">
                    {selectedEnd.toString().padStart(2, '0')}:00
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">المدة</p>
                  <p className="font-black text-blue-700 text-base">{duration} ساعة</p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedStart(null); setSelectedEnd(null); setRangeError('') }}
                className="mt-3 text-xs text-gray-400 underline w-full text-center"
              >
                إعادة الاختيار
              </button>
            </>
          ) : (
            <p className="text-amber-700 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              بداية: <strong>{selectedStart.toString().padStart(2, '0')}:00</strong>
              <span className="text-xs text-amber-500">← اختر ساعة النهاية</span>
            </p>
          )}
        </div>
      )}

      {/* دليل الألوان */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-1 border-t">
        {[
          { cls: 'bg-green-50 border-green-300',   label: 'متاح'     },
          { cls: 'bg-red-50 border-red-300',       label: 'محجوز 🔒' },
          ...(isAdmin ? [{ cls: 'bg-orange-50 border-orange-300', label: 'محجوز (قابل للتجاوز)' }] : []),
          { cls: 'bg-blue-600 border-blue-700',    label: 'مختار'    },
          { cls: 'bg-blue-100 border-blue-300',    label: 'النطاق'   },
          ...(!isAdmin ? [{ cls: 'bg-gray-100 border-gray-200', label: 'مضى' }] : []),
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