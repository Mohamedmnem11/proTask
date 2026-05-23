import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fieldId = searchParams.get('fieldId')
    const date = searchParams.get('date')

    if (!fieldId || !date) {
      return NextResponse.json(
        { error: 'fieldId and date are required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('booking')

    // جلب كل الحجوزات في هذا التاريخ لهذا الملعب
    const bookings = await db.collection('bookings').find({
      fieldId,
      date,
      status: { $ne: 'cancelled' }
    }).toArray()

    // جلب كل المباريات في هذا التاريخ لهذا الملعب
    const matches = await db.collection('matches').find({
      fieldId,
      date,
      status: { $in: ['open', 'full'] }
    }).toArray()

    // دمج الأوقات المحجوزة
    const bookedTimes = [
      ...bookings.map(b => ({ start: b.startTime, end: b.endTime })),
      ...matches.map(m => ({ start: m.startTime, end: m.endTime }))
    ]

    // توليد كل الأوقات الممكنة (من 6 صباحاً لـ 12 منتصف الليل)
    const allSlots = []
    for (let hour = 6; hour < 24; hour++) {
      allSlots.push({
        start: `${hour.toString().padStart(2, '0')}:00`,
        end: `${(hour + 1).toString().padStart(2, '0')}:00`
      })
    }

    // فلترة الأوقات المتاحة
    const availableSlots = allSlots.filter(slot => {
      return !bookedTimes.some(booked => 
        (slot.start >= booked.start && slot.start < booked.end) ||
        (slot.end > booked.start && slot.end <= booked.end)
      )
    })

    return NextResponse.json({ availableSlots })

  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}