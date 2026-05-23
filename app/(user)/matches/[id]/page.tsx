'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Trophy,
  UserPlus,
  Check,
  Loader2,
  ChevronRight,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import BookingTicket from '@/components/BookingTicket'

export default function MatchDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string
  
  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch (e) {
        console.error('Error parsing user:', e)
      }
    }
    fetchMatch()
  }, [])

  async function fetchMatch() {
    try {
      const data = await api.getMatch(matchId)
      setMatch(data.match)
    } catch (err: any) {
      console.error('Error fetching match:', err)
      setError(err.message || 'حدث خطأ في جلب بيانات المباراة')
      toast.error(err.message || 'حدث خطأ في جلب بيانات المباراة')
    } finally {
      setLoading(false)
    }
  }

  async function handleJoinRequest() {
    if (!user) {
      router.push(`/login?redirect=/matches/${matchId}`)
      return
    }

    try {
      await api.joinMatch(matchId, user._id || user.id)
      await fetchMatch()
      toast.success('✅ تم إرسال طلب الانضمام')
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">المباراة غير متاحة</h2>
            <p className="text-gray-600 mb-6">
              {error || 'هذه المباراة غير موجودة أو تم إلغاؤها'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.back()}>
                <ChevronRight className="w-4 h-4 ml-2" />
                رجوع
              </Button>
              <Link href="/matches">
                <Button variant="outline">
                  عرض المباريات المتاحة
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isCreator = match?.creatorId === (user?._id || user?.id)
  const hasRequested = match?.pendingRequests?.some((r: any) => r.userId === (user?._id || user?.id))
  const hasJoined = match?.players?.some((p: any) => p.userId === (user?._id || user?.id))
  const isFull = match?.players.length >= match?.totalNeeded

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" dir="rtl">
      {/* Back button */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 mb-6">
        <ChevronRight className="w-5 h-5" />
        <span>رجوع</span>
      </button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Match Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">{match.fieldName}</h1>
                <BookingTicket 
                  booking={{
                    _id: match._id,
                    fieldName: match.fieldName,
                    fieldLocation: match.fieldLocation,
                    date: match.date,
                    startTime: match.startTime,
                    endTime: match.endTime,
                    userName: match.creatorName,
                    totalPlayers: match.totalNeeded,
                    duration: match.duration || 3
                  }}
                  type="match"
                />
              </div>
              
              <div className="space-y-3 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{match.fieldLocation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(match.date).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{match.startTime} - {match.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>المستوى: {match.level}</span>
                </div>
              </div>

              {match.teamName && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-bold">اسم الفريق: {match.teamName}</p>
                </div>
              )}

              {match.notes && (
                <div className="p-3 bg-gray-50 rounded-lg mt-4">
                  <p className="text-gray-700">{match.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator Info */}
          <Card>
            <CardHeader>
              <CardTitle>منظم المباراة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {match.creatorName?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{match.creatorName}</h3>
                  <div className="flex gap-4 mt-2 text-gray-600">
                    {match.creatorPhone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{match.creatorPhone}</span>
                      </div>
                    )}
                    {match.creatorEmail && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{match.creatorEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Players List */}
          <Card>
            <CardHeader>
              <CardTitle>اللاعبون المنضمون ({match.players.length}/{match.totalNeeded})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {match.players.map((player: any) => (
                  <div key={player.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">حالة المباراة</h2>
              
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-blue-600">
                  {match.players.length}/{match.totalNeeded}
                </span>
                <p className="text-gray-600 mt-1">لاعبين</p>
              </div>

              <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(match.players.length / match.totalNeeded) * 100}%` }}
                />
              </div>

              <Badge className="w-full py-2 text-center" variant={isFull ? 'secondary' : 'default'}>
                {isFull ? 'مكتملة' : 'مفتوحة'}
              </Badge>

              {match.pendingRequests.length > 0 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg text-orange-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{match.pendingRequests.length} في الانتظار</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {!isCreator && (
            <Card>
              <CardContent className="p-6">
                {!hasJoined && !hasRequested && !isFull && (
                  <Button 
                    className="w-full gap-2"
                    onClick={handleJoinRequest}
                  >
                    <UserPlus className="w-4 h-4" />
                    طلب انضمام
                  </Button>
                )}

                {hasRequested && (
                  <Button className="w-full gap-2" variant="outline" disabled>
                    <Check className="w-4 h-4" />
                    تم إرسال الطلب
                  </Button>
                )}

                {hasJoined && (
                  <Button className="w-full gap-2" variant="outline" disabled>
                    <Check className="w-4 h-4" />
                    أنت منضم
                  </Button>
                )}

                {isFull && !hasJoined && (
                  <Button className="w-full" variant="outline" disabled>
                    اكتمل العدد
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Creator Actions */}
          {isCreator && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <Link href={`/matches/${matchId}/requests`}>
                  <Button className="w-full gap-2">
                    <Users className="w-4 h-4" />
                    طلبات الانضمام ({match.pendingRequests.length})
                  </Button>
                </Link>
                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="w-4 h-4" />
                  مراسلة اللاعبين
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}