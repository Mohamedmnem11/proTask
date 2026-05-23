import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/teams/[id] - جلب تفاصيل فريق
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('booking')
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف الفريق غير صالح' },
        { status: 400 }
      )
    }
    
    const team = await db.collection('teams').findOne({
      _id: new ObjectId(id)
    })
    
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'الفريق غير موجود' },
        { status: 404 }
      )
    }
    
    const responseTeam = {
      ...team,
      _id: team._id.toString(),
      captainId: team.captainId.toString(),
      members: team.members.map((m: any) => ({
        ...m,
        userId: m.userId.toString()
      }))
    }
    
    return NextResponse.json({ 
      success: true, 
      team: responseTeam 
    })
    
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب بيانات الفريق' },
      { status: 500 }
    )
  }
}

// PUT /api/teams/[id] - تحديث فريق
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف الفريق غير صالح' },
        { status: 400 }
      )
    }
    
    const result = await db.collection('teams').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...body,
          updatedAt: new Date()
        }
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'الفريق غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم تحديث الفريق بنجاح'
    })
    
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث الفريق' },
      { status: 500 }
    )
  }
}

// DELETE /api/teams/[id] - حذف فريق
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db('booking')
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'معرف الفريق غير صالح' },
        { status: 400 }
      )
    }
    
    const result = await db.collection('teams').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'الفريق غير موجود' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم حذف الفريق بنجاح' 
    })
    
  } catch (error) {
    console.error('Error deleting team:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في حذف الفريق' },
      { status: 500 }
    )
  }
}