// lib/data/user.ts
import 'server-only' // ⚠️ يمنع استيراد هذا الملف في Client Components
import { cache } from 'react'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

export const getCurrentUser = cache(async () => {
  const token = cookies().get('AUTH_TOKEN')?.value
  if (!token) return null
  
  const user = await db.collection('users').findOne({ token })
  
  // ⚠️ لا ترجع البيانات الحساسة للـ client
  return {
    id: user._id.toString(),
    name: user.name,
    role: user.role,
    // لا ترجع الـ token أو كلمة السر
  }
})

// دالة آمنة لجلب بيانات المباراة
export async function getMatchSafe(matchId: string) {
  const match = await db.collection('matches').findOne({
    _id: new ObjectId(matchId)
  })
  
  if (!match) return null
  
  // أرجع فقط البيانات اللي محتاجها الـ client
  return {
    id: match._id.toString(),
    fieldName: match.fieldName,
    fieldLocation: match.fieldLocation,
    date: match.date,
    startTime: match.startTime,
    endTime: match.endTime,
    players: match.players.map((p: any) => ({
      userId: p.userId.toString(),
      userName: p.userName,
    })),
    totalNeeded: match.totalNeeded,
    status: match.status,
  }
}