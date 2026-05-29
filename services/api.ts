// services/api.ts
// ✅ الصح
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  try {
    console.log(`📡 Fetching ${endpoint}:`, options)
    
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await res.json()
    console.log(`📡 Response from ${endpoint}:`, data)

    if (!res.ok) {
      throw new Error(data.error || 'حدث خطأ في الاتصال')
    }

    return data
  } catch (error) {
    console.error(`❌ Error in ${endpoint}:`, error)
    throw error
  }
}

export const api = {
  // Fields
  getFields: () => fetchAPI('/fields'),
  getField: (id: string) => fetchAPI(`/fields/${id}`),
  createField: (data: any) => fetchAPI('/fields', { method: 'POST', body: JSON.stringify(data) }),
  updateField: (id: string, data: any) => fetchAPI(`/fields/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteField: (id: string) => fetchAPI(`/fields/${id}`, { method: 'DELETE' }),

  // ✅ Availability (جديد)
  getAvailability: (fieldId: string, date: string) => 
    fetchAPI(`/availability?fieldId=${fieldId}&date=${date}`),

  // ✅ User Weekly Hours (جديد)
  getUserWeeklyHours: (userId: string) => 
    fetchAPI(`/user/weekly-hours?userId=${userId}`),

  // Bookings
  getBookings: (params?: string) => fetchAPI(`/bookings${params ? `?${params}` : ''}`),
  getBooking: (id: string) => fetchAPI(`/bookings/${id}`),
  createBooking: (data: any) => fetchAPI('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBooking: (id: string, data: any) => fetchAPI(`/bookings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  cancelBooking: (id: string) => fetchAPI(`/bookings/${id}`, { method: 'DELETE' }),

  // ✅ Confirmed Bookings (جديد)
  getConfirmedBookings: () => fetchAPI('/bookings/confirmed'),

  // Matches
  getMatches: (params?: string) => fetchAPI(`/matches${params ? `?${params}` : ''}`),
  getMatch: (id: string) => fetchAPI(`/matches/${id}`),
  
  createMatch: (data: any) => {
    const formattedData = {
      fieldId: data.fieldId,
      creatorId: data.creatorId || data.userId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      currentPlayers: 1,
      totalNeeded: data.playersNeeded || data.totalNeeded || 8,
      level: data.level || 'متوسط',
      notes: data.notes || '',
      teamName: data.teamName || ''
    }
    console.log('📤 Creating match:', formattedData)
    return fetchAPI('/matches', { 
      method: 'POST', 
      body: JSON.stringify(formattedData) 
    })
  },

  joinMatch: (matchId: string, userId: string) => {
    console.log('📤 Joining match:', { matchId, userId })
    return fetchAPI(`/matches/${matchId}/join`, { 
      method: 'POST', 
      body: JSON.stringify({ userId }) 
    })
  },

  acceptJoinRequest: (matchId: string, userId: string) => 
    fetchAPI(`/matches/${matchId}/accept`, { 
      method: 'POST', 
      body: JSON.stringify({ userId }) 
    }),

  rejectJoinRequest: (matchId: string, userId: string) => 
    fetchAPI(`/matches/${matchId}/reject`, { 
      method: 'POST', 
      body: JSON.stringify({ userId }) 
    }),

  // Notifications
  getNotifications: (userId: string) => {
    console.log('📡 Fetching notifications for userId:', userId)
    return fetchAPI(`/notifications?userId=${userId}`)
  },
  markAsRead: (id: string) => fetchAPI(`/notifications/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify({ read: true }) 
  }),
  deleteNotification: (id: string) => fetchAPI(`/notifications/${id}`, { 
    method: 'DELETE' 
  }),

  // Auth
  register: (data: any) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Users
  getUser: (id: string) => fetchAPI(`/users/${id}`),
  updateUser: (id: string, data: any) => fetchAPI(`/users/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),

  // Teams
  getTeams: (params?: string) => fetchAPI(`/teams${params ? `?${params}` : ''}`),
  getTeam: (id: string) => fetchAPI(`/teams/${id}`),
  createTeam: (data: any) => fetchAPI('/teams', { method: 'POST', body: JSON.stringify(data) }),
  updateTeam: (id: string, data: any) => fetchAPI(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTeam: (id: string) => fetchAPI(`/teams/${id}`, { method: 'DELETE' }),
  joinTeam: (teamId: string, userId: string, position?: string) => 
    fetchAPI(`/teams/${teamId}/join`, { method: 'POST', body: JSON.stringify({ userId, position }) }),
}