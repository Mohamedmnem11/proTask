'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Users, 
  Trophy, 
  Plus,
  Filter,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { api } from '@/services/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTeams()
  }, [])

  async function fetchTeams() {
    try {
      setLoading(true)
      const data = await api.getTeams()
      setTeams(data.teams || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  // فلترة الفرق
  const filteredTeams = teams.filter(team => 
    team.name?.includes(searchTerm) ||
    team.captainName?.includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">الفرق</h1>
          <p className="text-gray-600">
            ابحث عن فرق، انضم لفريق، أو أنشئ فريقك الخاص
          </p>
        </div>
        
        <Link href="/teams/create">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            إنشاء فريق جديد
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ابحث عن فريق..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-9"
          />
        </div>

        {/* Filter Dropdown */}
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="الكل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفرق</SelectItem>
            <SelectItem value="needs">ناقصة لاعبين</SelectItem>
            <SelectItem value="popular">الأكثر نشاطاً</SelectItem>
            <SelectItem value="new">الأحدث</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Button */}
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          فلتر
        </Button>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        {filteredTeams.length} {filteredTeams.length === 1 ? 'فريق' : 'فرق'}
      </div>

      {/* Teams Grid - زي التصميم بالظبط */}
      <div className="space-y-4">
        {filteredTeams.map((team) => {
          const needsPlayers = team.neededPositions?.length > 0
          const totalNeeded = team.neededPositions?.reduce((sum: number, pos: any) => sum + pos.count, 0) || 0
          
          return (
            <Card key={team._id} className="hover:shadow-lg transition cursor-pointer border-r-4 border-r-blue-600">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Team Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Team Logo */}
                      <Avatar className="w-16 h-16 border-2 border-blue-100">
                        <AvatarFallback className="bg-blue-600 text-white text-xl">
                          {team.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Team Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-xl font-bold">{team.name}</h3>
                          {needsPlayers && (
                            <Badge variant="destructive" className="gap-1">
                              <Users className="w-3 h-3" />
                              ناقص {totalNeeded}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          بواسطة: {team.captainName}
                        </p>
                        
                        {/* Team Stats */}
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{team.members?.length || 0} لاعب</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span>{team.stats?.wins || 0} فوز</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">{team.stats?.losses || 0} خسارة</span>
                          </div>
                        </div>

                        {/* Needed Positions - زي التصميم بالظبط */}
                        {needsPlayers && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-600">في الانتظار:</span>
                            {team.neededPositions.map((pos: any, idx: number) => (
                              <Badge key={idx} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                {pos.position} {pos.count > 1 ? `(${pos.count})` : ''}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Join Button */}
                  {needsPlayers && (
                    <Button variant="default" className="self-center bg-blue-600 hover:bg-blue-700">
                      طلب انضمام
                    </Button>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="mt-4 pt-4 border-t flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>آخر مباراة: {team.updatedAt ? new Date(team.updatedAt).toLocaleDateString('ar-EG') : 'لا توجد'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      {filteredTeams.length > 10 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="gap-2">
            عرض المزيد
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}