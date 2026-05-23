// scripts/note.ts
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  console.error('❌ MONGODB_URI غير موجود في البيئة')
  process.exit(1)
}

const client = new MongoClient(uri)

async function migrateNotifications() {
  console.log('🔄 بدء تحديث الإشعارات القديمة...')
  
  try {
    await client.connect()
    const db = client.db('booking')
    
    // 1. جلب كل المباريات اللي فيها طلبات
    const matches = await db.collection('matches').find({
      pendingRequests: { $exists: true, $ne: [] }
    }).toArray()
    
    console.log(`📊 تم العثور على ${matches.length} مباراة بها طلبات`)
    
    let updatedCount = 0
    
    // 2. تحديث الإشعارات لكل مباراة
    for (const match of matches) {
      for (const request of match.pendingRequests || []) {
        // بحث عن الإشعارات المرتبطة بالمباراة
        const result = await db.collection('notifications').updateMany(
          {
            relatedId: match._id.toString(),
            type: 'join_request',
            relatedUserId: { $exists: false }
          },
          {
            $set: { 
              relatedUserId: request.userId,
              requesterName: request.userName,
              requesterPhone: request.userPhone || '',
              requesterEmail: request.userEmail || ''
            }
          }
        )
        
        updatedCount += result.modifiedCount
      }
    }
    
    console.log(`✅ تم تحديث ${updatedCount} إشعار بنجاح`)
    
  } catch (error) {
    console.error('❌ خطأ في التحديث:', error)
  } finally {
    await client.close()
    process.exit(0)
  }
}

// شغّل الميجريشن
migrateNotifications()