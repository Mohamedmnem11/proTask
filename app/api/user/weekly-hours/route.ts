import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('booking')

    // حساب بداية ونهاية الأسبوع (الأحد إلى السبت)
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const startDateStr = startOfWeek.toISOString().split('T')[0]
    const endDateStr = endOfWeek.toISOString().split('T')[0]

    const [bookings, matches] = await Promise.all([
      db.collection('bookings').find({
        userId: userId,
        date: { $gte: startDateStr, $lte: endDateStr },
        status: { $ne: 'cancelled' }
      }).toArray(),
      
      db.collection('matches').find({
        creatorId: userId,
        date: { $gte: startDateStr, $lte: endDateStr },
        status: { $ne: 'cancelled' }
      }).toArray()
    ])

    const bookingHours = bookings.reduce((sum, booking) => {
      const startHour = parseInt(booking.startTime.split(':')[0])
      const endHour = parseInt(booking.endTime.split(':')[0])
      const duration = endHour - startHour
      return sum + (duration || 0)
    }, 0)

    const matchHours = matches.reduce((sum, match) => {
      if (match.duration) {
        return sum + match.duration
      } else {
        const startHour = parseInt(match.startTime.split(':')[0])
        const endHour = parseInt(match.endTime.split(':')[0])
        return sum + (endHour - startHour)
      }
    }, 0)

    const totalHours = bookingHours + matchHours

    console.log('📊 Weekly hours:', {
      userId,
      bookingHours,
      matchHours,
      totalHours,
      remaining: 3 - totalHours
    })

    return NextResponse.json({
      bookedHours: totalHours,
      remainingHours: Math.max(0, 3 - totalHours),
      maxHours: 3
    })

  } catch (error) {
    console.error('Error getting weekly hours:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}