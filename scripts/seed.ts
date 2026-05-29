import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import path from 'path'

// تحميل المتغيرات من ملف .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

console.log('✅ MONGODB_URI from env:', process.env.MONGODB_URI)

const MONGODB_URI = process.env.MONGODB_URI 

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db('booking')
    
    // مسح البيانات القديمة
    await db.collection('fields').deleteMany({})
    await db.collection('users').deleteMany({})
    await db.collection('bookings').deleteMany({})
    await db.collection('matches').deleteMany({})
    await db.collection('teams').deleteMany({}) // 🔥 مهم: امسح الفرق القديمة
    
    console.log('🗑️  تم مسح البيانات القديمة')

    // ========== 1. إضافة ملاعب تجريبية ==========
    await db.collection('fields').insertMany([
      {
        name: 'ملعب النادي الأهلي',
        location: 'الجزيرة',
        price: 250,
        type: 'عشب طبيعي',
        description: 'ملعب مجهز بأحدث المواصفات العالمية',
        amenities: ['wifi', 'cafe', 'parking', 'secure'],
        rating: 4.8,
        reviews: 128,
        images: [],
        isAvailable: true,
        createdAt: new Date()
      },
      {
        name: 'ملعب الزمالك',
        location: 'ميت عقبة',
        price: 200,
        type: 'نجيل صناعي',
        description: 'ملعب ممتاز مع إضاءة ليلية',
        amenities: ['wifi', 'parking'],
        rating: 4.6,
        reviews: 95,
        images: [],
        isAvailable: true,
        createdAt: new Date()
      },
      {
        name: 'ملعب القاهرة الدولي',
        location: 'مدينة نصر',
        price: 300,
        type: 'عشب طبيعي',
        description: 'ملعب دولي مجهز بالكامل',
        amenities: ['wifi', 'cafe', 'parking', 'secure'],
        rating: 4.9,
        reviews: 256,
        images: [],
        isAvailable: true,
        createdAt: new Date()
      },
      {
        name: 'ملعب بتروسبورت',
        location: 'التجمع الخامس',
        price: 280,
        type: 'عشب طبيعي',
        description: 'ملعب متميز مع كافتيريا',
        amenities: ['wifi', 'cafe', 'parking'],
        rating: 4.7,
        reviews: 182,
        images: [],
        isAvailable: true,
        createdAt: new Date()
      },
      {
        name: 'ملعب الدفاع الجوي',
        location: 'العباسية',
        price: 220,
        type: 'نجيل صناعي',
        description: 'ملعب جيد مع موقف سيارات',
        amenities: ['parking'],
        rating: 4.5,
        reviews: 67,
        images: [],
        isAvailable: true,
        createdAt: new Date()
      }
    ])
    console.log('✅ تم إضافة 5 ملاعب تجريبية')
    
    // ========== 2. إضافة مستخدمين تجريبيين ==========
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('123456', salt)
    
    await db.collection('users').insertMany([
      {
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '01234567890',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        createdAt: new Date()
      },
      {
        name: 'محمد علي',
        email: 'mohamed@example.com',
        phone: '01234567891',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        createdAt: new Date()
      },
      {
        name: 'مشرف النظام',
        email: 'admin@example.com',
        phone: '01234567892',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date()
      }
    ])
    console.log('✅ تم إضافة 3 مستخدمين تجريبيين')

    // ========== 3. جلب الملاعب والمستخدمين من قاعدة البيانات ==========
    const fieldsList = await db.collection('fields').find().toArray()
    const usersList = await db.collection('users').find().toArray()

    // ========== 4. إضافة فرق تجريبية (بعد ما usersList يكون موجود) ==========
    console.log('✅ جاري إضافة فرق تجريبية...')

    if (usersList.length > 0) {
      // فريق 1
      await db.collection('teams').insertOne({
        name: 'أهالي الجزيرة',
        logo: null,
        captainId: usersList[0]._id.toString(),
        captainName: usersList[0].name,
        members: [
          {
            userId: usersList[0]._id.toString(),
            userName: usersList[0].name,
            position: 'قائد الفريق',
            joinedAt: new Date()
          },
          {
            userId: usersList[1]._id.toString(),
            userName: usersList[1].name,
            position: 'حارس مرمى',
            joinedAt: new Date()
          }
        ],
        neededPositions: [
          { position: 'مدافع', count: 2 },
          { position: 'وسط', count: 1 }
        ],
        stats: {
          matchesPlayed: 5,
          wins: 3,
          losses: 2,
          draws: 0,
          goalsScored: 12,
          goalsConceded: 8
        },
        joinRequests: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // فريق 2
      await db.collection('teams').insertOne({
        name: 'شباب مدينة نصر',
        logo: null,
        captainId: usersList[1]._id.toString(),
        captainName: usersList[1].name,
        members: [
          {
            userId: usersList[1]._id.toString(),
            userName: usersList[1].name,
            position: 'قائد الفريق',
            joinedAt: new Date()
          },
          {
            userId: usersList[2]._id.toString(),
            userName: usersList[2].name,
            position: 'مهاجم',
            joinedAt: new Date()
          }
        ],
        neededPositions: [
          { position: 'مدافع', count: 1 },
          { position: 'وسط', count: 2 }
        ],
        stats: {
          matchesPlayed: 8,
          wins: 4,
          losses: 3,
          draws: 1,
          goalsScored: 18,
          goalsConceded: 15
        },
        joinRequests: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      // فريق 3 (مكتمل العدد)
      await db.collection('teams').insertOne({
        name: 'أصدقاء العباسية',
        logo: null,
        captainId: usersList[2]._id.toString(),
        captainName: usersList[2].name,
        members: [
          {
            userId: usersList[2]._id.toString(),
            userName: usersList[2].name,
            position: 'قائد الفريق',
            joinedAt: new Date()
          },
          {
            userId: usersList[0]._id.toString(),
            userName: usersList[0].name,
            position: 'مدافع',
            joinedAt: new Date()
          }
        ],
        neededPositions: [],
        stats: {
          matchesPlayed: 12,
          wins: 8,
          losses: 3,
          draws: 1,
          goalsScored: 28,
          goalsConceded: 14
        },
        joinRequests: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })

      console.log('✅ تم إضافة 3 فرق تجريبية')
    }

    // ========== 5. إضافة مباريات تجريبية ==========
    console.log('✅ جاري إضافة مباريات تجريبية...')

    if (fieldsList.length > 0 && usersList.length > 0) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]
      
      const dayAfter = new Date()
      dayAfter.setDate(dayAfter.getDate() + 2)
      const dayAfterStr = dayAfter.toISOString().split('T')[0]
      
      const threeDays = new Date()
      threeDays.setDate(threeDays.getDate() + 3)
      const threeDaysStr = threeDays.toISOString().split('T')[0]

      await db.collection('matches').insertOne({
        fieldId: fieldsList[0]._id.toString(),
        fieldName: fieldsList[0].name,
        fieldLocation: fieldsList[0].location,
        createdBy: usersList[1]._id.toString(),
        createdByName: usersList[1].name,
        date: tomorrowStr,
        startTime: '18:00',
        endTime: '21:00',
        playersNeeded: 8,
        playersJoined: 3,
        level: 'متوسط',
        notes: 'نحتاج 5 لاعبين',
        players: [
          {
            userId: usersList[1]._id.toString(),
            userName: usersList[1].name,
            joinedAt: new Date()
          },
          {
            userId: usersList[2]._id.toString(),
            userName: usersList[2].name,
            joinedAt: new Date()
          }
        ],
        waitingList: [],
        status: 'open',
        createdAt: new Date()
      })

      await db.collection('matches').insertOne({
        fieldId: fieldsList[1]._id.toString(),
        fieldName: fieldsList[1].name,
        fieldLocation: fieldsList[1].location,
        createdBy: usersList[0]._id.toString(),
        createdByName: usersList[0].name,
        date: dayAfterStr,
        startTime: '20:00',
        endTime: '23:00',
        playersNeeded: 10,
        playersJoined: 6,
        level: 'متقدم',
        notes: 'نحتاج مدافعين',
        players: [
          {
            userId: usersList[0]._id.toString(),
            userName: usersList[0].name,
            joinedAt: new Date()
          }
        ],
        waitingList: [
          {
            userId: usersList[2]._id.toString(),
            userName: usersList[2].name,
            requestedAt: new Date()
          }
        ],
        status: 'open',
        createdAt: new Date()
      })

      await db.collection('matches').insertOne({
        fieldId: fieldsList[2]._id.toString(),
        fieldName: fieldsList[2].name,
        fieldLocation: fieldsList[2].location,
        createdBy: usersList[2]._id.toString(),
        createdByName: usersList[2].name,
        date: threeDaysStr,
        startTime: '21:00',
        endTime: '00:00',
        playersNeeded: 8,
        playersJoined: 8,
        level: 'مبتدئ',
        notes: 'اكتمل العدد',
        players: [
          {
            userId: usersList[2]._id.toString(),
            userName: usersList[2].name,
            joinedAt: new Date()
          }
        ],
        waitingList: [],
        status: 'full',
        createdAt: new Date()
      })
      
      console.log('✅ تم إضافة 3 مباريات تجريبية')
    }

    console.log('\n🎉 **تم إضافة جميع البيانات التجريبية بنجاح**')
    console.log('\n📊 ملخص:')
    console.log('- 5 ملاعب')
    console.log('- 3 مستخدمين')
    console.log('- 3 فرق')
    console.log('- 3 مباريات')
    
    console.log('\n🔑 بيانات الدخول التجريبية:')
    console.log('مستخدم: ahmed@example.com / 123456')
    console.log('مستخدم: mohamed@example.com / 123456')
    console.log('أدمن: admin@example.com / 123456')
    
  } catch (error) {
    console.error('❌ خطأ:', error)
  } finally {
    process.exit()
  }
}

seed()