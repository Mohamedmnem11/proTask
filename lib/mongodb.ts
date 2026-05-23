import { MongoClient, MongoClientOptions } from 'mongodb'

const uri = process.env.MONGODB_URI as string
const options: MongoClientOptions = {}

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local')
}

// تخزين الاتصال في globalThis في وضع التطوير فقط
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  const client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise