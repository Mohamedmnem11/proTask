import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    
    // جلب كل الملاعب (الغير محذوفة)
    const fields = await db.collection('fields')
      .find({ deleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ 
      success: true,
      fields 
    })
    
  } catch (error) {
    console.error('Error fetching fields:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب الملاعب' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    
    // التحقق من البيانات
    if (!body.name || !body.location || !body.price) {
      return NextResponse.json(
        { success: false, error: 'البيانات المطلوبة ناقصة' },
        { status: 400 }
      )
    }
    
    // إضافة الملعب
    const result = await db.collection('fields').insertOne({
      ...body,
      rating: 0,
      reviews: 0,
      images: body.images || [],
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    // جلب الملعب المضاف
    const newField = await db.collection('fields').findOne({
      _id: result.insertedId
    })
    
    return NextResponse.json({ 
      success: true,
      message: 'تم إضافة الملعب بنجاح',
      field: newField 
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating field:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إضافة الملعب' },
      { status: 500 }
    )
  }
}