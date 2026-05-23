import { MetadataRoute } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = await clientPromise
  const db = client.db('booking')
  
  const matches = await db.collection('matches')
    .find({ status: { $in: ['open', 'full'] } })
    .toArray()
  
  const matchUrls = matches.map((match) => ({
    url: `https://yourdomain.com/matches/${match._id}`,
    lastModified: match.updatedAt,
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://yourdomain.com/matches',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    ...matchUrls,
  ]
}