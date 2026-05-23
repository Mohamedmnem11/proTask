import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    
    // جرب نضيف collection صغير
    const result = await db.collection('test').insertOne({
      message: 'اتصال MongoDB شغال!',
      createdAt: new Date()
    })
    
    // نجيب البيانات اللي ضفناها
    const data = await db.collection('test').find({}).toArray()
    
    return NextResponse.json({ 
      success: true, 
      message: '✅ اتصال MongoDB ناجح',
      data 
    })
    
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: '❌ فشل الاتصال بقاعدة البيانات' 
    }, { status: 500 })
  }
}