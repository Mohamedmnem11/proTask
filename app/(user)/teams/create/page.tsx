'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Camera, 
  Users, 
  Plus, 
  X, 
  Search,
  Trophy,
  ChevronRight 
} from 'lucide-react'
import Link from 'next/link'

interface Player {
  id: string
  name: string
  position: string
  avatar?: string
}

export default function CreateTeamPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: أساسيات, 2: إضافة لاعبين, 3: تأكيد
  const [teamName, setTeamName] = useState('')
  const [teamLogo, setTeamLogo] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'أحمد محمد', position: 'حارس مرمى' },
    { id: '2', name: 'محمود علي', position: 'مدافع' }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(['1', '2'])

  // لاعبين مقترحين (من قاعدة البيانات)
  const suggestedPlayers = [
    { id: '3', name: 'محمد عبدالله', position: 'وسط', matches: 15 },
    { id: '4', name: 'عمر هشام', position: 'مهاجم', matches: 22 },
    { id: '5', name: 'خالد سعيد', position: 'مدافع', matches: 8 },
  ]

  const handleAddPlayer = (playerId: string) => {
    setSelectedPlayers([...selectedPlayers, playerId])
  }

  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter(id => id !== playerId))
  }

  const handleCreateTeam = () => {
    // حفظ الفريق في قاعدة البيانات
    console.log('Creating team:', {
      name: teamName,
      logo: teamLogo,
      players: selectedPlayers
    })
    router.push('/teams')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" dir="rtl">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">إنشاء فريق جديد</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold
              ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
            `}>
              {s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>معلومات الفريق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Logo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-blue-100">
                  <AvatarFallback className="bg-blue-600 text-white text-3xl">
                    {teamName ? teamName.slice(0, 2).toUpperCase() : '👥'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500">اضغط لرفع شعار الفريق</p>
            </div>

            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="teamName">اسم الفريق</Label>
              <Input
                id="teamName"
                placeholder="مثال: أهالي الجزيرة"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>

            {/* Team Stats Preview */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-xs text-gray-600">مباريات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-xs text-gray-600">فوز</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">0</div>
                <div className="text-xs text-gray-600">خسارة</div>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={() => setStep(2)}
              disabled={!teamName}
            >
              التالي: إضافة لاعبين
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Add Players */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة لاعبين</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Players */}
            <div>
              <h3 className="font-bold mb-3">لاعبين الفريق ({selectedPlayers.length})</h3>
              <div className="space-y-2">
                {players.filter(p => selectedPlayers.includes(p.id)).map(player => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {player.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{player.name}</p>
                        <p className="text-sm text-gray-600">{player.position}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemovePlayer(player.id)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Players */}
            <div>
              <h3 className="font-bold mb-3">إضافة لاعبين جدد</h3>
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="ابحث عن لاعب..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-9"
                />
              </div>

              {/* Suggested Players */}
              <div className="space-y-2">
                {suggestedPlayers
                  .filter(p => !selectedPlayers.includes(p.id))
                  .map(player => (
                    <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gray-600 text-white">
                            {player.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">{player.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{player.position}</span>
                            <span>•</span>
                            <span>{player.matches} مباراة</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAddPlayer(player.id)}
                      >
                        <Plus className="w-4 h-4 ml-1" />
                        إضافة
                      </Button>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                رجوع
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                التالي: تأكيد
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>تأكيد إنشاء الفريق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {teamName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{teamName}</h2>
                  <p className="text-gray-600">{selectedPlayers.length} لاعبين</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-white rounded-lg text-center">
                  <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                  <span className="font-bold">0 فوز</span>
                </div>
                <div className="p-3 bg-white rounded-lg text-center">
                  <Users className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <span className="font-bold">{selectedPlayers.length} لاعب</span>
                </div>
              </div>
            </div>

            {/* Players List */}
            <div>
              <h3 className="font-bold mb-3">قائمة اللاعبين</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {players.filter(p => selectedPlayers.includes(p.id)).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 w-6">{index + 1}</span>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                          {player.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold">{player.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{player.position}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                رجوع
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleCreateTeam}>
                إنشاء الفريق
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}