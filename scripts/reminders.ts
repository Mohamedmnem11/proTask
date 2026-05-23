// scripts/reminders.ts
// شغله كل يوم بـ cron job

import { MongoClient } from 'mongodb'
import 'dotenv/config'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booking'

async function sendReminders() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('booking')
    
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]
    
    // جلب حجوزات بكرة
    const bookings = await db.collection('bookings').find({
      date: tomorrowStr,
      status: 'confirmed'
    }).toArray()
    
    console.log(`Found ${bookings.length} bookings for tomorrow`)
    
    // إرسال إشعار لكل حجز
    for (const booking of bookings) {
      await db.collection('notifications').insertOne({
        userId: booking.userId,
        type: 'booking_reminder',
        title: 'تذكير بحجز بكرة',
        message: `عندك حجز بكرة في ${booking.fieldName} الساعة ${booking.startTime}`,
        relatedId: booking._id.toString(),
        read: false,
        createdAt: new Date()
      })
      
      console.log(`Reminder sent to user ${booking.userId}`)
    }
    
    // إشعار قبل ساعة من الحجز
    const now = new Date()
    const currentHour = now.getHours()
    
    const todayBookings = await db.collection('bookings').find({
      date: now.toISOString().split('T')[0],
      status: 'confirmed'
    }).toArray()
    
    for (const booking of todayBookings) {
      const bookingHour = parseInt(booking.startTime.split(':')[0])
      if (bookingHour - currentHour === 1) {
        await db.collection('notifications').insertOne({
          userId: booking.userId,
          type: 'booking_reminder',
          title: 'تذكير باقتراب موعد الحجز',
          message: `موعد حجزك في ${booking.fieldName} بعد ساعة`,
          relatedId: booking._id.toString(),
          read: false,
          createdAt: new Date()
        })
      }
    }
    
  } catch (error) {
    console.error('Error sending reminders:', error)
  } finally {
    await client.close()
  }
}

// تشغيل الدالة
sendReminders().catch(console.error)