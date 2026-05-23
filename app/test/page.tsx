'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Trophy,
  UserPlus,
  Check,
  Loader2,
  Filter,
  MoreVertical,
  Clock as ClockIcon,
  Plus,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Match } from '@/types/match'

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [user, setUser] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch {
        // ignore
      }
    }
    loadMatches()
  }, [])

  async function loadMatches() {
    try {
      setLoading(true)
      setError('')
      const data = await api.getMatches()
      setMatches(data.matches || data.data || [])
    } catch (err: unknown) {
      const e = err as Error
      setError(e.message || 'حدث خطأ في جلب المباريات')
    } finally {
      setLoading(false)
    }
  }

  async function handleJoinMatch(matchId: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!user) {
      router.push('/login?redirect=/matches')
      return
    }

    try {
      await api.joinMatch(
        matchId,
        user._id || user.id,
        user.name,
        user.phone,
        user.email
      )
      await loadMatches()
    } catch (err: unknown) {
      const e = err as Error
      alert(e.message || 'حدث خطأ في الانضمام')
    }
  }

  const userId = user?._id || user?.id

  function getUserMatchStatus(match: Match) {
    if (match.players?.some((p) => p.userId === userId)) return 'joined'
    const req = match.pendingRequests?.find((r) => r.userId === userId)
    if (req?.status === 'pending') return 'pending'
    if (req?.status === 'accepted') return 'joined'
    return 'none'
  }

  const filteredMatches = matches.filter((m) => {
    if (filter === 'open') return m.status === 'open'
    if (filter === 'full') return m.status === 'full'
    return true
  })

  const openCount = matches.filter((m) => m.status === 'open').length
  const totalSpots = matches.reduce((acc, m) => acc + (m.totalNeeded - (m.currentPlayers ?? m.players?.length ?? 0)), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">جاري تحميل المباريات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      {/* ─── Top Nav ─── */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">كورة بوك ⚽</h1>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-1 shadow-sm"
            onClick={() => router.push('/matches/create')}
          >
            <Plus className="w-4 h-4" />
            مباراة جديدة
          </Button>
        </div>
      </div>

      {/* ─── Hero Banner ─── */}
      <div className="bg-gradient-to-l from-blue-600 to-green-500 px-4 py-8 text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">مباريات ناقصة لاعبين</h2>
          <p className="opacity-90 text-sm mb-5">انضم لمباراة محتاجة لاعبين ولعب مع ناس جديدة</p>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-bold">{openCount}</div>
              <div className="text-xs opacity-80">مباراة مفتوحة</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-bold">{Math.max(0, totalSpots)}</div>
              <div className="text-xs opacity-80">مكان شاغر</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-bold">{matches.reduce((a, m) => a + (m.players?.length ?? 0), 0)}</div>
              <div className="text-xs opacity-80">لاعب نشط</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Filter Bar ─── */}
      <div className="sticky top-14 z-10 bg-white border-b px-4 py-2.5">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="border-0 bg-transparent p-0 h-auto focus:ring-0 text-sm font-medium text-gray-700 w-auto gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المباريات</SelectItem>
              <SelectItem value="open">المفتوحة فقط</SelectItem>
              <SelectItem value="full">المكتملة</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-gray-400 mr-auto">{filteredMatches.length} نتيجة</span>
        </div>
      </div>

      {/* ─── Error ─── */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        </div>
      )}

      {/* ─── Matches List ─── */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⚽</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">لا توجد مباريات حالياً</h3>
            <p className="text-gray-500 text-sm mb-6">كن الأول وأنشئ مباراة!</p>
            <Button
              className="bg-gradient-to-l from-blue-600 to-green-500"
              onClick={() => router.push('/matches/create')}
            >
              إنشاء مباراة جديدة
            </Button>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const userStatus = getUserMatchStatus(match)
            const currentCount = match.currentPlayers ?? match.players?.length ?? 0
            const isFull = currentCount >= match.totalNeeded || match.status === 'full'
            const progress = Math.min(100, (currentCount / match.totalNeeded) * 100)
            const spotsLeft = match.totalNeeded - currentCount
            const pendingCount = match.pendingRequests?.filter((r) => r.status === 'pending').length ?? 0

            return (
              <Card
                key={match._id}
                className="overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => router.push(`/matches/${match._id}`)}
              >
                {/* Status stripe */}
                <div
                  className={`h-1 ${
                    match.status === 'open'
                      ? 'bg-gradient-to-l from-blue-500 to-green-500'
                      : match.status === 'full'
                        ? 'bg-gray-300'
                        : 'bg-red-300'
                  }`}
                />

                <CardContent className="p-4">
                  {/* Creator row */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-bl from-blue-500 to-green-500 text-white text-xs font-bold">
                        {match.creatorName?.slice(0, 2) ?? '؟'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 truncate">{match.creatorName}</p>
                      <p className="text-xs text-gray-400">منظم المباراة</p>
                    </div>
                    <Badge
                      variant={match.status === 'open' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        match.status === 'open'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {match.status === 'open' ? 'مفتوح' : match.status === 'full' ? 'مكتمل' : 'ملغي'}
                    </Badge>
                  </div>

                  {/* Field name + team */}
                  <h3 className="font-bold text-gray-900 text-base mb-0.5 group-hover:text-blue-700 transition-colors">
                    {match.teamName || match.fieldName}
                  </h3>
                  {match.teamName && (
                    <p className="text-xs text-gray-500 mb-2">{match.fieldName}</p>
                  )}

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-3 mt-2">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{match.fieldLocation}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      {new Date(match.date).toLocaleDateString('ar-EG')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      {match.startTime} – {match.endTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      {match.level}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {currentCount} / {match.totalNeeded} لاعب
                      </span>
                      {!isFull && (
                        <span className="text-green-600 font-semibold">
                          {spotsLeft} مكان شاغر
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull
                            ? 'bg-gray-400'
                            : 'bg-gradient-to-l from-blue-500 to-green-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {pendingCount > 0 && (
                      <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        {pendingCount} طلب في الانتظار
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  {match.status === 'open' && !isFull && userStatus === 'none' && (
                    <Button
                      className="w-full h-9 text-sm bg-gradient-to-l from-blue-600 to-green-500 hover:opacity-90 gap-2"
                      onClick={(e) => handleJoinMatch(match._id, e)}
                    >
                      <UserPlus className="w-4 h-4" />
                      طلب انضمام
                    </Button>
                  )}
                  {userStatus === 'pending' && (
                    <Button className="w-full h-9 text-sm gap-2" variant="outline" disabled>
                      <ClockIcon className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600">طلبك قيد المراجعة</span>
                    </Button>
                  )}
                  {userStatus === 'joined' && (
                    <Button className="w-full h-9 text-sm gap-2 border-green-200 text-green-700 bg-green-50" variant="outline" disabled>
                      <Check className="w-4 h-4" />
                      أنت ضمن الفريق
                    </Button>
                  )}
                  {isFull && userStatus === 'none' && (
                    <Button className="w-full h-9 text-sm" variant="outline" disabled>
                      اكتمل العدد
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* ─── Bottom Navigation ─── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-1.5 px-2 flex justify-around">
        {[
          { icon: '🏠', label: 'الرئيسية', href: '/' },
          { icon: '⚽', label: 'المباريات', href: '/matches', active: true },
          { icon: '🏆', label: 'الفرق', href: '/teams' },
          { icon: '👤', label: 'حسابي', href: '/profile' },
          { icon: '🔔', label: 'الإشعارات', href: '/notifications' },
        ].map((item) => (
          <button
            key={item.href}
            className={`flex flex-col items-center p-1.5 min-w-[52px] rounded-lg transition ${
              item.active
                ? 'text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => router.push(item.href)}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}