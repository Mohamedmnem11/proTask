'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  X, 
  Loader2, 
  Phone, 
  Mail, 
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function MatchRequestsPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string
  
  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userStr))
    fetchMatch()
  }, [])

  async function fetchMatch() {
    try {
      const data = await api.getMatch(matchId)
      setMatch(data.match)
    } catch (error) {
      console.error('Error fetching match:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept(userId: string) {
    try {
      await api.acceptJoinRequest(matchId, userId)
      await fetchMatch()
    } catch (error: any) {
      alert(error.message || 'حدث خطأ')
    }
  }

  async function handleReject(userId: string) {
    try {
      await api.rejectJoinRequest(matchId, userId)
      await fetchMatch()
    } catch (error: any) {
      alert(error.message || 'حدث خطأ')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>المباراة غير موجودة</p>
      </div>
    )
  }

  // التحقق من أن المستخدم هو المنشئ
  if (match.creatorId !== (user?._id || user?.id)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>غير مصرح لك بمشاهدة هذه الصفحة</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">طلبات الانضمام</h1>
      </div>

      {/* Match Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{match.fieldName}</h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{match.fieldLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(match.date).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{match.startTime} - {match.endTime}</span>
                </div>
              </div>
            </div>
            <div className="text-left">
              <Badge variant="success" className="text-lg">
                {match.players.length}/{match.totalNeeded} لاعبين
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {match.pendingRequests?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">لا توجد طلبات انتظار</p>
            </CardContent>
          </Card>
        ) : (
          match.pendingRequests?.map((request: any) => (
            <Card key={request.userId}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {request.userName?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{request.userName}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{request.userPhone || 'لا يوجد رقم'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{request.userEmail || 'لا يوجد بريد'}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        طلب في: {new Date(request.requestedAt).toLocaleString('ar-EG')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAccept(request.userId)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 ml-2" />
                      قبول
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleReject(request.userId)}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 ml-2" />
                      رفض
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Current Players */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">اللاعبون المنضمون</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {match.players?.map((player: any) => (
            <Card key={player.userId}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-green-600 text-white">
                      {player.userName?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{player.userName}</p>
                    <p className="text-xs text-gray-500">
                      انضم: {new Date(player.joinedAt).toLocaleString('ar-EG')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}