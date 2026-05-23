import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/teams - جلب كل الفرق
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const { searchParams } = new URL(request.url)
    
    const filter: any = {}
    const captainId = searchParams.get('captainId')
    const needsPlayers = searchParams.get('needsPlayers')
    
    if (captainId) {
      filter.captainId = captainId
    }
    
    if (needsPlayers === 'true') {
      filter['neededPositions.0'] = { $exists: true }
    }
    
    const teams = await db.collection('teams')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()
    
    const responseTeams = teams.map(team => ({
      ...team,
      _id: team._id.toString(),
      captainId: team.captainId.toString(),
      members: team.members.map((m: any) => ({
        ...m,
        userId: m.userId.toString()
      }))
    }))
    
    return NextResponse.json({ 
      success: true, 
      teams: responseTeams 
    })
    
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب الفرق' },
      { status: 500 }
    )
  }
}

// POST /api/teams - إنشاء فريق جديد
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db('booking')
    const body = await request.json()
    
    console.log('Creating team:', body)
    
    // التحقق من البيانات
    if (!body.name || !body.captainId) {
      return NextResponse.json(
        { success: false, error: 'اسم الفريق وقائد الفريق مطلوبان' },
        { status: 400 }
      )
    }
    
    // جلب بيانات القائد
    const captain = await db.collection('users').findOne({
      _id: new ObjectId(body.captainId)
    })
    
    if (!captain) {
      return NextResponse.json(
        { success: false, error: 'قائد الفريق غير موجود' },
        { status: 404 }
      )
    }
    
    // إعداد أعضاء الفريق
    const members = [
      {
        userId: body.captainId,
        userName: captain.name,
        position: 'قائد الفريق',
        joinedAt: new Date()
      },
      ...(body.members || []).map((m: any) => ({
        userId: m.userId,
        userName: m.userName,
        position: m.position,
        joinedAt: new Date()
      }))
    ]
    
    // إعداد المراكز الناقصة
    const neededPositions = body.neededPositions || []
    
    // إنشاء الفريق
    const newTeam = {
      name: body.name,
      logo: body.logo || null,
      captainId: body.captainId,
      captainName: captain.name,
      members,
      neededPositions,
      stats: {
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        goalsScored: 0,
        goalsConceded: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('teams').insertOne(newTeam)
    
    return NextResponse.json({ 
      success: true, 
      message: 'تم إنشاء الفريق بنجاح',
      teamId: result.insertedId.toString()
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إنشاء الفريق' },
      { status: 500 }
    )
  }
}