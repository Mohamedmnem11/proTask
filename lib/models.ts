// lib/models.ts
import { MongoClient, ObjectId, Db } from 'mongodb'

const uri = process.env.MONGODB_URI!
const client = new MongoClient(uri)
const db: Db = client.db('soccer-booking')

export interface User {
  _id?: ObjectId
  email: string
  name: string
  role: 'user' | 'admin'
}

export interface Field {
  _id?: ObjectId
  name: string
  location: string
}

export interface Match {
  _id?: ObjectId
  creatorId: string
  fieldId: string
  startTime: Date
  endTime: Date
  totalPlayers: number
  currentPlayers: number
  status: 'open' | 'full' | 'cancelled'
  createdAt: Date
}

export interface MatchRequest {
  _id?: ObjectId
  matchId: string
  userId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}

export interface MatchPlayer {
  _id?: ObjectId
  matchId: string
  userId: string
  joinedAt: Date
}

export const collections = {
  users: db.collection<User>('users'),
  fields: db.collection<Field>('fields'),
  matches: db.collection<Match>('matches'),
  matchRequests: db.collection<MatchRequest>('matchRequests'),
  matchPlayers: db.collection<MatchPlayer>('matchPlayers')
}