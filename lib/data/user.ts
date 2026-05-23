import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies()  // ✅ await
  const token = cookieStore.get('AUTH_TOKEN')?.value
  
  if (!token) return null
  
  const client = await clientPromise
  const db = client.db('booking')
  
  const user = await db.collection('users').findOne({ token })
  
  if (!user) return null
  
  // ✅ لا ترجع البيانات الحساسة للـ client
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }
})

// دالة آمنة لجلب بيانات المباراة
export async function getMatchSafe(matchId: string) {
  const client = await clientPromise
  const db = client.db('booking')
  
  const match = await db.collection('matches').findOne({
    _id: new ObjectId(matchId)
  })
  
  if (!match) return null
  
  // ✅ أرجع فقط البيانات اللي محتاجها الـ client
  return {
    id: match._id.toString(),
    fieldName: match.fieldName,
    fieldLocation: match.fieldLocation,
    date: match.date,
    startTime: match.startTime,
    endTime: match.endTime,
    players: match.players?.map((p: any) => ({
      userId: p.userId?.toString(),
      userName: p.userName,
    })) || [],
    totalNeeded: match.totalNeeded,
    status: match.status,
  }
}