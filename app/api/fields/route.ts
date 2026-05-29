import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET: إما جلب كل الملاعب أو ملعب واحد (إذا وُجد query parameter 'id')
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // الحصول على المعرف من ?id=xxxx

    const client = await clientPromise;
    const db = client.db('booking');

    if (id) {
      // جلب ملعب واحد
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, error: 'معرف غير صالح' }, { status: 400 });
      }
      const field = await db.collection('fields').findOne({ _id: new ObjectId(id) });
      if (!field) {
        return NextResponse.json({ success: false, error: 'الملعب غير موجود' }, { status: 404 });
      }
      // تحويل _id إلى string
      const responseField = { ...field, _id: field._id.toString() };
      return NextResponse.json({ success: true, field: responseField });
    } else {
      // جلب كل الملاعب
      const fields = await db.collection('fields').find({ deleted: { $ne: true } }).sort({ createdAt: -1 }).toArray();
      // تحويل _id لكل ملعب إلى string
      const fieldsWithStringId = fields.map(f => ({ ...f, _id: f._id.toString() }));
      return NextResponse.json({ success: true, fields: fieldsWithStringId });
    }
  } catch (error) {
    console.error('Error in GET /api/fields:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في جلب البيانات' }, { status: 500 });
  }
}

// POST: إضافة ملعب جديد (موجود بالفعل)
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('booking');
    const body = await request.json();
    if (!body.name || !body.location || !body.price) {
      return NextResponse.json({ success: false, error: 'البيانات المطلوبة ناقصة' }, { status: 400 });
    }
    const result = await db.collection('fields').insertOne({
      ...body,
      rating: 0,
      reviews: 0,
      images: body.images || [],
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const newField = await db.collection('fields').findOne({ _id: result.insertedId });
    return NextResponse.json({ success: true, message: 'تم إضافة الملعب', field: newField }, { status: 201 });
  } catch (error) {
    console.error('Error creating field:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في إضافة الملعب' }, { status: 500 });
  }
}

// PUT: تحديث ملعب (معرف عبر query parameter id)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'معرف الملعب مطلوب' }, { status: 400 });
    if (!ObjectId.isValid(id)) return NextResponse.json({ success: false, error: 'معرف غير صالح' }, { status: 400 });
    
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('booking');
    const result = await db.collection('fields').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'الملعب غير موجود' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'تم تحديث الملعب' });
  } catch (error) {
    console.error('Error updating field:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في تحديث الملعب' }, { status: 500 });
  }
}

// DELETE: حذف ملعب (معرف عبر query parameter id)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'معرف الملعب مطلوب' }, { status: 400 });
    if (!ObjectId.isValid(id)) return NextResponse.json({ success: false, error: 'معرف غير صالح' }, { status: 400 });
    
    const client = await clientPromise;
    const db = client.db('booking');
    const result = await db.collection('fields').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'الملعب غير موجود' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'تم حذف الملعب' });
  } catch (error) {
    console.error('Error deleting field:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في حذف الملعب' }, { status: 500 });
  }
}