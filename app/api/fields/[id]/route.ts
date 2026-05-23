import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/fields/[id] - جلب ملعب محدد
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // <-- 1. غيّر النوع إلى Promise
) {
  try {
    const { id } = await params // <-- 2. استخدم await لاستخراج id

    console.log('Fetching field with ID:', id)

    // التحقق من صحة الـ ID
    if (!ObjectId.isValid(id)) {
      console.log('Invalid ID format:', id)
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('booking')

    // جلب الملعب من قاعدة البيانات
    const field = await db.collection('fields').findOne({
      _id: new ObjectId(id)
    })

    console.log('Found field:', field ? 'Yes' : 'No')

    if (!field) {
      return NextResponse.json(
        { success: false, error: 'الملعب غير موجود' },
        { status: 404 }
      )
    }

    // تحويل _id إلى string للـ JSON
    const responseField = {
      ...field,
      _id: field._id.toString()
    }

    return NextResponse.json({
      success: true,
      field: responseField
    })

  } catch (error) {
    console.error('Error fetching field:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب بيانات الملعب' },
      { status: 500 }
    )
  }
}

// ... (بقية دوال PUT و DELETE تبقى كما هي، ولكن تأكد من تعديلها بنفس الطريقة)
// يجب عليك تطبيق نفس التغيير على PUT و DELETE أيضاً
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // ... باقي الكود
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    // ... باقي المنطق
  } catch (error) {
    // ...
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // ... باقي الكود
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف غير صالح' },
        { status: 400 }
      )
    }
    // ... باقي المنطق
  } catch (error) {
    // ...
  }
}