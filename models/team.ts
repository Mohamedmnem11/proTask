// models/Team.ts
export interface Team {
  _id: string
  name: string
  logo?: string
  captainId: string
  captainName: string
  members: TeamMember[]
  stats: TeamStats
  neededPositions: NeededPosition[]
  createdAt: Date
  updatedAt: Date
}

export interface TeamMember {
  userId: string
  userName: string
  position: string
  joinedAt: Date
}

export interface TeamStats {
  matchesPlayed: number
  wins: number
  losses: number
  draws: number
  goalsScored: number
  goalsConceded: number
}

export interface NeededPosition {
  position: string
  count: number
}