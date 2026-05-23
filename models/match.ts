export interface Match {
  _id: string
  
  // بيانات الحجز
  fieldId: string
  fieldName: string
  fieldLocation: string
  date: string
  startTime: string
  endTime: string
  
  // بيانات المنشئ
  creatorId: string
  creatorName: string
  creatorPhone: string
  creatorEmail: string
  
  // بيانات المباراة
  teamName?: string
  currentPlayers: number
  totalNeeded: number
  level: string
  notes?: string
  
  status: 'open' | 'full' | 'cancelled'
  
  // اللاعبون المقبولون
  players: {
    userId: string
    userName: string
    userPhone?: string
    userEmail?: string
    joinedAt: Date
  }[]
  
  // قائمة الانتظار
  pendingRequests: {
    userId: string
    userName: string
    userPhone?: string
    userEmail?: string
    requestedAt: Date
    status: 'pending' | 'accepted' | 'rejected'
  }[]
  
  createdAt: Date
  updatedAt: Date
}