

//import { NextResponse } from 'next/server'
// import clientPromise from '@/lib/mongodb'
// import { ObjectId } from 'mongodb'

// export async function GET(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const { searchParams } = new URL(request.url)

//     const userId = searchParams.get('userId')
//     const fieldId = searchParams.get('fieldId')
//     const date = searchParams.get('date')
//     const startDate = searchParams.get('startDate')
//     const endDate = searchParams.get('endDate')
//     const status = searchParams.get('status')
//     const isAdmin = searchParams.get('isAdmin') === 'true'

//     console.log('📢 GET /api/bookings - Params:', { userId, fieldId, date, startDate, endDate, status })

//     const filter: any = {}

//     // ✅ فلترة المستخدم
//     if (!isAdmin && userId) {
//       filter.userId = userId
//     }

//     // ✅ فلترة الملعب - بيتعامل مع string و ObjectId
//     if (fieldId) {
//       if (ObjectId.isValid(fieldId)) {
//         // جرب الاتنين عشان DB ممكن يحفظ بأي طريقة
//         filter.$or = [
//           { fieldId: fieldId },                    // string
//           { fieldId: new ObjectId(fieldId) }       // ObjectId
//         ]
//       } else {
//         filter.fieldId = fieldId
//       }
//     }

//     // ✅ فلترة التاريخ
//     if (startDate && endDate) {
//       filter.date = { $gte: startDate, $lte: endDate }
//     } else if (date) {
//       filter.date = date
//     }

//     // ✅ فلترة الحالة
//     if (status) {
//       filter.status = status
//     }

//     console.log('🔍 Filter:', JSON.stringify(filter, null, 2))

//     const bookings = await db.collection('bookings')
//       .find(filter)
//       .sort({ date: 1, startTime: 1 })
//       .toArray()

//     console.log(`✅ Found ${bookings.length} bookings`)

//     const responseBookings = bookings.map(booking => ({
//       ...booking,
//       _id: booking._id.toString(),
//       fieldId: booking.fieldId?.toString(),
//       userId: booking.userId?.toString()
//     }))

//     return NextResponse.json({
//       success: true,
//       bookings: responseBookings,
//       count: responseBookings.length
//     })

//   } catch (error) {
//     console.error('❌ Error fetching bookings:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في جلب الحجوزات' },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const body = await request.json()

//     console.log('📢 Creating booking:', body)

//     const required = ['fieldId', 'userId', 'date', 'startTime', 'endTime', 'duration']
//     for (const field of required) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { success: false, error: `الحقل ${field} مطلوب` },
//           { status: 400 }
//         )
//       }
//     }

//     if (!ObjectId.isValid(body.fieldId) || !ObjectId.isValid(body.userId)) {
//       return NextResponse.json(
//         { success: false, error: 'معرف غير صالح' },
//         { status: 400 }
//       )
//     }

//     const user = await db.collection('users').findOne({
//       _id: new ObjectId(body.userId)
//     })

//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'المستخدم غير موجود' },
//         { status: 404 }
//       )
//     }

//     if (user.role !== 'admin' && body.duration > 3) {
//       return NextResponse.json(
//         { success: false, error: 'لا يمكن الحجز لأكثر من 3 ساعات' },
//         { status: 400 }
//       )
//     }

//     // ✅ التحقق من التعارض - بيتعامل مع string و ObjectId
//     if (user.role !== 'admin') {
//       const startHour = parseInt(body.startTime.split(':')[0])
//       const duration = parseInt(body.duration)

//       for (let h = 0; h < duration; h++) {
//         const checkTime = `${(startHour + h).toString().padStart(2, '0')}:00`

//         const conflicting = await db.collection('bookings').findOne({
//           $or: [
//             { fieldId: body.fieldId },
//             { fieldId: new ObjectId(body.fieldId) }
//           ],
//           date: body.date,
//           startTime: checkTime,
//           status: { $ne: 'cancelled' }
//         })

//         if (conflicting) {
//           return NextResponse.json(
//             { success: false, error: `الوقت ${checkTime} محجوز بالفعل` },
//             { status: 400 }
//           )
//         }
//       }
//     }

//     const field = await db.collection('fields').findOne({
//       _id: new ObjectId(body.fieldId)
//     })

//     if (!field) {
//       return NextResponse.json(
//         { success: false, error: 'الملعب غير موجود' },
//         { status: 404 }
//       )
//     }

//     const totalPrice = field.price * body.duration

//     const newBooking = {
//       fieldId: body.fieldId,           // ✅ نحفظ كـ string
//       fieldName: field.name,
//       fieldLocation: field.location,
//       userId: body.userId,             // ✅ نحفظ كـ string
//       userName: user.name,
//       userPhone: user.phone || '',
//       date: body.date,
//       startTime: body.startTime,
//       endTime: body.endTime,
//       duration: parseInt(body.duration),
//       price: field.price,
//       totalPrice,
//       notes: body.notes || '',
//       status: 'confirmed',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }

//     const result = await db.collection('bookings').insertOne(newBooking)

//     // إشعار للمستخدم
//     await db.collection('notifications').insertOne({
//       userId: body.userId,
//       type: 'booking_confirmed',
//       title: 'تم تأكيد حجزك ✅',
//       message: `تم تأكيد حجزك في ${field.name} يوم ${body.date} الساعة ${body.startTime}`,
//       relatedId: result.insertedId.toString(),
//       read: false,
//       createdAt: new Date()
//     })

//     const booking = await db.collection('bookings').findOne({ _id: result.insertedId })

//     return NextResponse.json({
//       success: true,
//       message: 'تم إنشاء الحجز بنجاح',
//       booking: {
//         ...booking,
//         _id: booking?._id.toString(),
//         fieldId: booking?.fieldId?.toString(),
//         userId: booking?.userId?.toString()
//       }
//     }, { status: 201 })

//   } catch (error) {
//     console.error('❌ Error creating booking:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في إنشاء الحجز' },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const body = await request.json()
//     const { id, ...updateData } = body

//     if (!id || !ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'معرف الحجز غير صالح' },
//         { status: 400 }
//       )
//     }

//     const result = await db.collection('bookings').updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { ...updateData, updatedAt: new Date() } }
//     )

//     if (result.matchedCount === 0) {
//       return NextResponse.json(
//         { success: false, error: 'الحجز غير موجود' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json({ success: true, message: 'تم تحديث الحجز بنجاح' })

//   } catch (error) {
//     console.error('❌ Error updating booking:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في تحديث الحجز' },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get('id')
//     const userId = searchParams.get('userId')

//     if (!id || !ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'معرف الحجز غير صالح' },
//         { status: 400 }
//       )
//     }

//     const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) })

//     if (!booking) {
//       return NextResponse.json(
//         { success: false, error: 'الحجز غير موجود' },
//         { status: 404 }
//       )
//     }

//     if (booking.status === 'cancelled') {
//       return NextResponse.json(
//         { success: false, error: 'الحجز ملغي بالفعل' },
//         { status: 400 }
//       )
//     }

//     const user = userId && ObjectId.isValid(userId)
      // // ?await db.collection('users').findOne({ _id: new ObjectId(userId) })
//       : null

//     // التحقق من سياسة الإلغاء للمستخدم العادي
//     if (user?.role !== 'admin') {
//       const bookingDate = new Date(booking.date)
//       const [hours] = booking.startTime.split(':')
//       bookingDate.setHours(parseInt(hours), 0, 0)
//       const hoursDiff = (bookingDate.getTime() - Date.now()) / (1000 * 60 * 60)

//       if (hoursDiff < 12) {
//         return NextResponse.json(
//           { success: false, error: 'لا يمكن إلغاء الحجز قبل أقل من 12 ساعة' },
//           { status: 400 }
//         )
//       }
//     }

//     await db.collection('bookings').updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { status: 'cancelled', cancelledAt: new Date(), cancelledBy: user?.role === 'admin' ? 'admin' : 'user' } }
//     )

//     await db.collection('notifications').insertOne({
//       userId: booking.userId,
//       type: 'booking_cancelled',
//       title: user?.role === 'admin' ? 'تم إلغاء حجزك بواسطة الإدارة' : 'تم إلغاء حجزك',
//       message: `تم إلغاء حجزك في ${booking.fieldName} يوم ${booking.date}`,
//       relatedId: id,
//       read: false,
//       createdAt: new Date()
//     })

//     return NextResponse.json({ success: true, message: 'تم إلغاء الحجز بنجاح' })

//   } catch (error) {
//     console.error('❌ Error cancelling booking:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في إلغاء الحجز' },
//       { status: 500 }
//     )
//   }
// }


// import { NextResponse } from 'next/server'
// import clientPromise from '@/lib/mongodb'
// import { ObjectId } from 'mongodb'

// export async function GET(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const { searchParams } = new URL(request.url)

//     const userId = searchParams.get('userId')
//     const fieldId = searchParams.get('fieldId')
//     const date = searchParams.get('date')
//     const startDate = searchParams.get('startDate')
//     const endDate = searchParams.get('endDate')
//     const status = searchParams.get('status')
//     const isAdmin = searchParams.get('isAdmin') === 'true'

//     console.log('📢 GET /api/bookings - Params:', { userId, fieldId, date, startDate, endDate, status })

//     const filter: any = {}

//     // ✅ فلترة المستخدم
//     if (!isAdmin && userId) {
//       filter.userId = userId
//     }

//     // ✅ فلترة الملعب - بيتعامل مع string و ObjectId
//     if (fieldId) {
//       if (ObjectId.isValid(fieldId)) {
//         filter.$or = [
//           { fieldId: fieldId },
//           { fieldId: new ObjectId(fieldId) }
//         ]
//       } else {
//         filter.fieldId = fieldId
//       }
//     }

//     // ✅ فلترة التاريخ
//     if (startDate && endDate) {
//       filter.date = { $gte: startDate, $lte: endDate }
//     } else if (date) {
//       filter.date = date
//     }

//     // ✅ فلترة الحالة
//     if (status) {
//       filter.status = status
//     }

//     console.log('🔍 Filter:', JSON.stringify(filter, null, 2))

//     const bookings = await db.collection('bookings')
//       .find(filter)
//       .sort({ date: 1, startTime: 1 })
//       .toArray()

//     console.log(`✅ Found ${bookings.length} bookings`)

//     const responseBookings = bookings.map(booking => ({
//       ...booking,
//       _id: booking._id.toString(),
//       fieldId: booking.fieldId?.toString(),
//       userId: booking.userId?.toString()
//     }))

//     return NextResponse.json({
//       success: true,
//       bookings: responseBookings,
//       count: responseBookings.length
//     })

//   } catch (error) {
//     console.error('❌ Error fetching bookings:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في جلب الحجوزات' },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const body = await request.json()

//     console.log('📢 Creating booking:', body)

//     const required = ['fieldId', 'userId', 'date', 'startTime', 'endTime', 'duration']
//     for (const field of required) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { success: false, error: `الحقل ${field} مطلوب` },
//           { status: 400 }
//         )
//       }
//     }

//     if (!ObjectId.isValid(body.fieldId) || !ObjectId.isValid(body.userId)) {
//       return NextResponse.json(
//         { success: false, error: 'معرف غير صالح' },
//         { status: 400 }
//       )
//     }

//     const user = await db.collection('users').findOne({
//       _id: new ObjectId(body.userId)
//     })

//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'المستخدم غير موجود' },
//         { status: 404 }
//       )
//     }

//     if (user.role !== 'admin' && body.duration > 3) {
//       return NextResponse.json(
//         { success: false, error: 'لا يمكن الحجز لأكثر من 3 ساعات' },
//         { status: 400 }
//       )
//     }

//     // ✅ التحقق من التعارض
//     if (user.role !== 'admin') {
//       const startHour = parseInt(body.startTime.split(':')[0])
//       const duration = parseInt(body.duration)

//       for (let h = 0; h < duration; h++) {
//         const checkTime = `${(startHour + h).toString().padStart(2, '0')}:00`

//         const conflicting = await db.collection('bookings').findOne({
//           $or: [
//             { fieldId: body.fieldId },
//             { fieldId: new ObjectId(body.fieldId) }
//           ],
//           date: body.date,
//           startTime: checkTime,
//           status: { $ne: 'cancelled' }
//         })

//         if (conflicting) {
//           return NextResponse.json(
//             { success: false, error: `الوقت ${checkTime} محجوز بالفعل` },
//             { status: 400 }
//           )
//         }
//       }
//     }

//     const field = await db.collection('fields').findOne({
//       _id: new ObjectId(body.fieldId)
//     })

//     if (!field) {
//       return NextResponse.json(
//         { success: false, error: 'الملعب غير موجود' },
//         { status: 404 }
//       )
//     }

//     // ✅ التحقق من وجود totalPlayers
//     const totalPlayers = body.totalPlayers || 0

//     // ✅ إذا العدد الإجمالي أقل من 10، ننشئ مباراة
//     if (totalPlayers > 0 && totalPlayers < 10) {
//       // إنشاء مباراة جديدة
//       const matchData = {
//         fieldId: body.fieldId,
//         fieldName: field.name,
//         fieldLocation: field.location,
//         creatorId: body.userId,
//         creatorName: user.name,
//         date: body.date,
//         startTime: body.startTime,
//         endTime: body.endTime,
//         duration: body.duration,
//         currentPlayers: 1,
//         totalNeeded: totalPlayers,
//         level: body.level || 'متوسط',
//         notes: body.notes || '',
//         fromBooking: true,
//         status: 'open',
//         players: [
//           {
//             userId: body.userId,
//             userName: user.name,
//             userPhone: user.phone || '',
//             userEmail: user.email,
//             joinedAt: new Date()
//           }
//         ],
//         pendingRequests: [],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }

//       const matchResult = await db.collection('matches').insertOne(matchData)

//       // إشعار للمستخدم
//       await db.collection('notifications').insertOne({
//         userId: body.userId,
//         type: 'match_created',
//         title: 'تم إنشاء مباراة جديدة ⚽',
//         message: `تم إنشاء مباراة في ${field.name} يوم ${body.date} الساعة ${body.startTime}`,
//         relatedId: matchResult.insertedId.toString(),
//         read: false,
//         createdAt: new Date()
//       })

//       return NextResponse.json({
//         success: true,
//         message: 'تم إنشاء المباراة بنجاح',
//         matchId: matchResult.insertedId.toString(),
//         type: 'match'
//       }, { status: 201 })
//     }

//     // ✅ إنشاء حجز عادي
//     const totalPrice = field.price * body.duration

//     const newBooking = {
//       fieldId: body.fieldId,
//       fieldName: field.name,
//       fieldLocation: field.location,
//       userId: body.userId,
//       userName: user.name,
//       userPhone: user.phone || '',
//       date: body.date,
//       startTime: body.startTime,
//       endTime: body.endTime,
//       duration: parseInt(body.duration),
//       price: field.price,
//       totalPrice,
//       totalPlayers: totalPlayers > 0 ? totalPlayers : null,
//       notes: body.notes || '',
//       status: 'confirmed',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }

//     const result = await db.collection('bookings').insertOne(newBooking)

//     // إشعار للمستخدم
//     await db.collection('notifications').insertOne({
//       userId: body.userId,
//       type: 'booking_confirmed',
//       title: 'تم تأكيد حجزك ✅',
//       message: `تم تأكيد حجزك في ${field.name} يوم ${body.date} الساعة ${body.startTime}`,
//       relatedId: result.insertedId.toString(),
//       read: false,
//       createdAt: new Date()
//     })

//     const booking = await db.collection('bookings').findOne({ _id: result.insertedId })

//     return NextResponse.json({
//       success: true,
//       message: 'تم إنشاء الحجز بنجاح',
//       booking: {
//         ...booking,
//         _id: booking?._id.toString(),
//         fieldId: booking?.fieldId?.toString(),
//         userId: booking?.userId?.toString()
//       },
//       type: 'booking'
//     }, { status: 201 })

//   } catch (error) {
//     console.error('❌ Error creating booking:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في إنشاء الحجز' },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const body = await request.json()
//     const { id, ...updateData } = body

//     if (!id || !ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'معرف الحجز غير صالح' },
//         { status: 400 }
//       )
//     }

//     const result = await db.collection('bookings').updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { ...updateData, updatedAt: new Date() } }
//     )

//     if (result.matchedCount === 0) {
//       return NextResponse.json(
//         { success: false, error: 'الحجز غير موجود' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json({ success: true, message: 'تم تحديث الحجز بنجاح' })

//   } catch (error) {
//     console.error('❌ Error updating booking:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في تحديث الحجز' },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get('id')
//     const userId = searchParams.get('userId')

//     if (!id || !ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'معرف الحجز غير صالح' },
//         { status: 400 }
//       )
//     }

//     const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) })

//     if (!booking) {
//       return NextResponse.json(
//         { success: false, error: 'الحجز غير موجود' },
//         { status: 404 }
//       )
//     }

//     if (booking.status === 'cancelled') {
//       return NextResponse.json(
//         { success: false, error: 'الحجز ملغي بالفعل' },
//         { status: 400 }
//       )
//     }

//     const user = userId && ObjectId.isValid(userId)
//       ? await db.collection('users').findOne({ _id: new ObjectId(userId) })
//       : null

//     // التحقق من سياسة الإلغاء للمستخدم العادي
//     if (user?.role !== 'admin') {
//       const bookingDate = new Date(booking.date)
//       const [hours] = booking.startTime.split(':')
//       bookingDate.setHours(parseInt(hours), 0, 0)
//       const hoursDiff = (bookingDate.getTime() - Date.now()) / (1000 * 60 * 60)

//       if (hoursDiff < 12) {
//         return NextResponse.json(
//           { success: false, error: 'لا يمكن إلغاء الحجز قبل أقل من 12 ساعة' },
//           { status: 400 }
//         )
//       }
//     }

//     await db.collection('bookings').updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { status: 'cancelled', cancelledAt: new Date(), cancelledBy: user?.role === 'admin' ? 'admin' : 'user' } }
//     )

//     await db.collection('notifications').insertOne({
//       userId: booking.userId,
//       type: 'booking_cancelled',
//       title: user?.role === 'admin' ? 'تم إلغاء حجزك بواسطة الإدارة' : 'تم إلغاء حجزك',
//       message: `تم إلغاء حجزك في ${booking.fieldName} يوم ${booking.date}`,
//       relatedId: id,
//       read: false,
//       createdAt: new Date()
//     })

//     return NextResponse.json({ success: true, message: 'تم إلغاء الحجز بنجاح' })

//   } catch (error) {
//     console.error('❌ Error cancelling booking:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في إلغاء الحجز' },
//       { status: 500 }
//     )
//   }
// }



// import { NextResponse } from 'next/server'
// import clientPromise from '@/lib/mongodb'
// import { ObjectId } from 'mongodb'

// export async function GET(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const { searchParams } = new URL(request.url)

//     const userId = searchParams.get('userId')
//     const fieldId = searchParams.get('fieldId')
//     const date = searchParams.get('date')
//     const startDate = searchParams.get('startDate')
//     const endDate = searchParams.get('endDate')
//     const status = searchParams.get('status')
//     const isAdmin = searchParams.get('isAdmin') === 'true'

//     console.log('📢 GET /api/bookings - Params:', { userId, fieldId, date, startDate, endDate, status })

//     const filter: any = {}

//     if (!isAdmin && userId) {
//       filter.userId = userId
//     }

//     if (fieldId) {
//       if (ObjectId.isValid(fieldId)) {
//         filter.$or = [
//           { fieldId: fieldId },
//           { fieldId: new ObjectId(fieldId) }
//         ]
//       } else {
//         filter.fieldId = fieldId
//       }
//     }

//     if (startDate && endDate) {
//       filter.date = { $gte: startDate, $lte: endDate }
//     } else if (date) {
//       filter.date = date
//     }

//     if (status) {
//       filter.status = status
//     }

//     console.log('🔍 Filter:', JSON.stringify(filter, null, 2))

//     const bookings = await db.collection('bookings')
//       .find(filter)
//       .sort({ date: 1, startTime: 1 })
//       .toArray()

//     console.log(`✅ Found ${bookings.length} bookings`)

//     const responseBookings = bookings.map(booking => ({
//       ...booking,
//       _id: booking._id.toString(),
//       fieldId: booking.fieldId?.toString(),
//       userId: booking.userId?.toString()
//     }))

//     return NextResponse.json({
//       success: true,
//       bookings: responseBookings,
//       count: responseBookings.length
//     })

//   } catch (error) {
//     console.error('❌ Error fetching bookings:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في جلب الحجوزات' },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const body = await request.json()

//     console.log('📢 Creating booking:', body)

//     const required = ['fieldId', 'userId', 'date', 'startTime', 'endTime', 'duration']
//     for (const field of required) {
//       if (!body[field]) {
//         return NextResponse.json(
//           { success: false, error: `الحقل ${field} مطلوب` },
//           { status: 400 }
//         )
//       }
//     }

//     if (!ObjectId.isValid(body.fieldId) || !ObjectId.isValid(body.userId)) {
//       return NextResponse.json(
//         { success: false, error: 'معرف غير صالح' },
//         { status: 400 }
//       )
//     }

//     const user = await db.collection('users').findOne({
//       _id: new ObjectId(body.userId)
//     })

//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'المستخدم غير موجود' },
//         { status: 404 }
//       )
//     }

//     // ✅ التحقق من حد 3 ساعات أسبوعياً (للمستخدم العادي فقط)
//     if (user.role !== 'admin') {
//       // حساب بداية ونهاية الأسبوع (من الأحد إلى السبت)
//       const now = new Date()
//       const startOfWeek = new Date(now)
//       startOfWeek.setDate(now.getDate() - now.getDay())
//       startOfWeek.setHours(0, 0, 0, 0)
      
//       const endOfWeek = new Date(startOfWeek)
//       endOfWeek.setDate(startOfWeek.getDate() + 6)
//       endOfWeek.setHours(23, 59, 59, 999)

//       const startDateStr = startOfWeek.toISOString().split('T')[0]
//       const endDateStr = endOfWeek.toISOString().split('T')[0]

//       // جلب كل حجوزات المستخدم هذا الأسبوع
//       const [userBookings, userMatches] = await Promise.all([
//         db.collection('bookings').find({
//           userId: user._id.toString(),
//           date: { $gte: startDateStr, $lte: endDateStr },
//           status: { $ne: 'cancelled' }
//         }).toArray(),
        
//         db.collection('matches').find({
//           creatorId: user._id.toString(),
//           date: { $gte: startDateStr, $lte: endDateStr },
//           status: { $ne: 'cancelled' }
//         }).toArray()
//       ])

//       // حساب مجموع الساعات من الحجوزات
//       const bookingHours = userBookings.reduce((sum, booking) => {
//         const startHour = parseInt(booking.startTime.split(':')[0])
//         const endHour = parseInt(booking.endTime.split(':')[0])
//         return sum + (endHour - startHour)
//       }, 0)

//       // حساب مجموع الساعات من المباريات
//       const matchHours = userMatches.reduce((sum, match) => {
//         const startHour = parseInt(match.startTime.split(':')[0])
//         const endHour = parseInt(match.endTime.split(':')[0])
//         return sum + (endHour - startHour)
//       }, 0)

//       const totalHours = bookingHours + matchHours
//       const newDuration = parseInt(body.duration)

//       console.log('📊 Weekly hours check:', {
//         userId: user._id.toString(),
//         totalHours,
//         newDuration,
//         remaining: 3 - totalHours
//       })

//       if (totalHours + newDuration > 3) {
//         const remaining = 3 - totalHours
//         return NextResponse.json({
//           success: false,
//           error: `⚠️ لا يمكنك تجاوز 3 ساعات في الأسبوع\n\n` +
//                  `• الساعات المحجوزة: ${totalHours} من 3\n` +
//                  `• الساعات المطلوبة: ${newDuration}\n` +
//                  `• الساعات المتبقية: ${remaining}`
//         }, { status: 400 })
//       }
//     }

//     const field = await db.collection('fields').findOne({
//       _id: new ObjectId(body.fieldId)
//     })

//     if (!field) {
//       return NextResponse.json(
//         { success: false, error: 'الملعب غير موجود' },
//         { status: 404 }
//       )
//     }

//     const totalPlayers = body.totalPlayers || 0

//     // ✅ إذا العدد الإجمالي أقل من 10، ننشئ مباراة
//     if (totalPlayers > 0 && totalPlayers < 10) {
//       const matchData = {
//         fieldId: body.fieldId,
//         fieldName: field.name,
//         fieldLocation: field.location,
//         creatorId: body.userId,
//         creatorName: user.name,
//         date: body.date,
//         startTime: body.startTime,
//         endTime: body.endTime,
//         duration: body.duration,
//         currentPlayers: 1,
//         totalNeeded: totalPlayers,
//         level: body.level || 'متوسط',
//         notes: body.notes || '',
//         fromBooking: true,
//         status: 'open',
//         players: [
//           {
//             userId: body.userId,
//             userName: user.name,
//             userPhone: user.phone || '',
//             userEmail: user.email,
//             joinedAt: new Date()
//           }
//         ],
//         pendingRequests: [],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }

//       const matchResult = await db.collection('matches').insertOne(matchData)

//       await db.collection('notifications').insertOne({
//         userId: body.userId,
//         type: 'match_created',
//         title: 'تم إنشاء مباراة جديدة ⚽',
//         message: `تم إنشاء مباراة في ${field.name} يوم ${body.date} الساعة ${body.startTime}`,
//         relatedId: matchResult.insertedId.toString(),
//         read: false,
//         createdAt: new Date()
//       })

//       return NextResponse.json({
//         success: true,
//         message: 'تم إنشاء المباراة بنجاح',
//         matchId: matchResult.insertedId.toString(),
//         type: 'match'
//       }, { status: 201 })
//     }

//     // ✅ إنشاء حجز عادي
//     const totalPrice = field.price * body.duration

//     const newBooking = {
//       fieldId: body.fieldId,
//       fieldName: field.name,
//       fieldLocation: field.location,
//       userId: body.userId,
//       userName: user.name,
//       userPhone: user.phone || '',
//       date: body.date,
//       startTime: body.startTime,
//       endTime: body.endTime,
//       duration: parseInt(body.duration),
//       price: field.price,
//       totalPrice,
//       totalPlayers: totalPlayers > 0 ? totalPlayers : null,
//       notes: body.notes || '',
//       status: 'confirmed',
//       createdAt: new Date(),
//       updatedAt: new Date()
//     }

//     const result = await db.collection('bookings').insertOne(newBooking)

//     await db.collection('notifications').insertOne({
//       userId: body.userId,
//       type: 'booking_confirmed',
//       title: 'تم تأكيد حجزك ✅',
//       message: `تم تأكيد حجزك في ${field.name} يوم ${body.date} الساعة ${body.startTime}`,
//       relatedId: result.insertedId.toString(),
//       read: false,
//       createdAt: new Date()
//     })

//     const booking = await db.collection('bookings').findOne({ _id: result.insertedId })

//     return NextResponse.json({
//       success: true,
//       message: 'تم إنشاء الحجز بنجاح',
//       booking: {
//         ...booking,
//         _id: booking?._id.toString(),
//         fieldId: booking?.fieldId?.toString(),
//         userId: booking?.userId?.toString()
//       },
//       type: 'booking'
//     }, { status: 201 })

//   } catch (error) {
//     console.error('❌ Error creating booking:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في إنشاء الحجز' },
//       { status: 500 }
//     )
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const body = await request.json()
//     const { id, ...updateData } = body

//     if (!id || !ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'معرف الحجز غير صالح' },
//         { status: 400 }
//       )
//     }

//     const result = await db.collection('bookings').updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { ...updateData, updatedAt: new Date() } }
//     )

//     if (result.matchedCount === 0) {
//       return NextResponse.json(
//         { success: false, error: 'الحجز غير موجود' },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json({ success: true, message: 'تم تحديث الحجز بنجاح' })

//   } catch (error) {
//     console.error('❌ Error updating booking:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في تحديث الحجز' },
//       { status: 500 }
//     )
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const client = await clientPromise
//     const db = client.db('booking')
//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get('id')
//     const userId = searchParams.get('userId')

//     if (!id || !ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { success: false, error: 'معرف الحجز غير صالح' },
//         { status: 400 }
//       )
//     }

//     const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) })

//     if (!booking) {
//       return NextResponse.json(
//         { success: false, error: 'الحجز غير موجود' },
//         { status: 404 }
//       )
//     }

//     if (booking.status === 'cancelled') {
//       return NextResponse.json(
//         { success: false, error: 'الحجز ملغي بالفعل' },
//         { status: 400 }
//       )
//     }

//     const user = userId && ObjectId.isValid(userId)
//       ? await db.collection('users').findOne({ _id: new ObjectId(userId) })
//       : null

//     if (user?.role !== 'admin') {
//       const bookingDate = new Date(booking.date)
//       const [hours] = booking.startTime.split(':')
//       bookingDate.setHours(parseInt(hours), 0, 0)
//       const hoursDiff = (bookingDate.getTime() - Date.now()) / (1000 * 60 * 60)

//       if (hoursDiff < 12) {
//         return NextResponse.json(
//           { success: false, error: 'لا يمكن إلغاء الحجز قبل أقل من 12 ساعة' },
//           { status: 400 }
//         )
//       }
//     }

//     await db.collection('bookings').updateOne(
//       { _id: new ObjectId(id) },
//       { $set: { status: 'cancelled', cancelledAt: new Date(), cancelledBy: user?.role === 'admin' ? 'admin' : 'user' } }
//     )

//     await db.collection('notifications').insertOne({
//       userId: booking.userId,
//       type: 'booking_cancelled',
//       title: user?.role === 'admin' ? 'تم إلغاء حجزك بواسطة الإدارة' : 'تم إلغاء حجزك',
//       message: `تم إلغاء حجزك في ${booking.fieldName} يوم ${booking.date}`,
//       relatedId: id,
//       read: false,
//       createdAt: new Date()
//     })

//     return NextResponse.json({ success: true, message: 'تم إلغاء الحجز بنجاح' })

//   } catch (error) {
//     console.error('❌ Error cancelling booking:', error)
//     return NextResponse.json(
//       { success: false, error: 'حدث خطأ في إلغاء الحجز' },
//       { status: 500 }
//     )
//   }
// }



import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import nodemailer from 'nodemailer'

// ══════════════════════════════════════════════════════════════
// GET /api/bookings
// ══════════════════════════════════════════════════════════════
export async function GET(request: Request) {
  try {
    const client = await clientPromise
    const db     = client.db('booking')
    const { searchParams } = new URL(request.url)

    const userId    = searchParams.get('userId')
    const fieldId   = searchParams.get('fieldId')
    const date      = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate   = searchParams.get('endDate')
    const status    = searchParams.get('status')
    const isAdmin   = searchParams.get('isAdmin') === 'true'

    const filter: any = {}
    if (!isAdmin && userId) filter.userId = userId

    if (fieldId) {
      filter.$or = ObjectId.isValid(fieldId)
        ? [{ fieldId }, { fieldId: new ObjectId(fieldId) }]
        : [{ fieldId }]
    }

    if (startDate && endDate) filter.date = { $gte: startDate, $lte: endDate }
    else if (date) filter.date = date
    if (status) filter.status = status

    const bookings = await db.collection('bookings')
      .find(filter).sort({ date: 1, startTime: 1 }).toArray()

    return NextResponse.json({
      success:  true,
      bookings: bookings.map(b => ({
        ...b,
        _id:     b._id.toString(),
        fieldId: b.fieldId?.toString(),
        userId:  b.userId?.toString(),
      })),
      count: bookings.length,
    })

  } catch (error) {
    console.error('❌ GET /api/bookings:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في جلب الحجوزات' }, { status: 500 })
  }
}

// ══════════════════════════════════════════════════════════════
// POST /api/bookings — تأكيد حجز
// ══════════════════════════════════════════════════════════════
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db     = client.db('booking')
    const body   = await request.json()

    console.log('📢 Creating booking:', body)

    // ── التحقق من الحقول ───────────────────────────────────
    const required = ['fieldId', 'userId', 'date', 'startTime', 'endTime', 'duration']
    for (const f of required) {
      if (!body[f]) {
        return NextResponse.json({ success: false, error: `الحقل ${f} مطلوب` }, { status: 400 })
      }
    }

    if (!ObjectId.isValid(body.fieldId) || !ObjectId.isValid(body.userId)) {
      return NextResponse.json({ success: false, error: 'معرف غير صالح' }, { status: 400 })
    }

    // ── جلب المستخدم ───────────────────────────────────────
    const user = await db.collection('users').findOne({ _id: new ObjectId(body.userId) })
    if (!user) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const duration = Number(body.duration)

    // ══════════════════════════════════════════════════════
    // ✅ فحص الحد الأسبوعي — Admin مستثنى
    // ══════════════════════════════════════════════════════
    if (user.role !== 'admin') {
      const check = await weeklyLimitCheck(db, user._id.toString(), body.date, duration)
      if (!check.allowed) {
        return NextResponse.json({ success: false, error: check.message }, { status: 400 })
      }
    }

    // ── جلب الملعب ──────────────────────────────────────────
    const field = await db.collection('fields').findOne({ _id: new ObjectId(body.fieldId) })
    if (!field) {
      return NextResponse.json({ success: false, error: 'الملعب غير موجود' }, { status: 404 })
    }

    const totalPlayers = Number(body.totalPlayers || 0)

    // ══════════════════════════════════════════════════════
    // ✅ لو العدد أقل من 10 → ننشئ مباراة + نبعت إشعارات
    // ══════════════════════════════════════════════════════
    if (totalPlayers > 0 && totalPlayers < 10) {
      // التحقق من التعارض
      const conflict = await db.collection('matches').findOne({
        fieldId: body.fieldId, date: body.date, startTime: body.startTime,
        status: { $in: ['open', 'full'] }
      })
      if (conflict) {
        return NextResponse.json({ success: false, error: 'هناك مباراة أخرى في هذا الوقت' }, { status: 400 })
      }

      const matchDoc = {
        fieldId:       body.fieldId,
        fieldName:     field.name,
        fieldLocation: field.location,
        creatorId:     body.userId,
        creatorName:   user.name,
        creatorPhone:  user.phone || '',
        creatorEmail:  user.email || '',
        date:          body.date,
        startTime:     body.startTime,
        endTime:       body.endTime,
        duration,
        currentPlayers: 1,
        totalNeeded:   totalPlayers,
        level:         body.level || 'متوسط',
        notes:         body.notes || '',
        fromBooking:   true,
        status:        'open',
        players: [{
          userId:    body.userId,
          userName:  user.name,
          userPhone: user.phone || '',
          userEmail: user.email || '',
          joinedAt:  new Date(),
        }],
        pendingRequests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const matchResult = await db.collection('matches').insertOne(matchDoc)
      const matchId     = matchResult.insertedId.toString()

      // إنشاء الحجز المرتبط
      await db.collection('bookings').insertOne({
        fieldId:   body.fieldId,
        fieldName: field.name,
        userId:    body.userId,
        userName:  user.name,
        userPhone: user.phone || '',
        userEmail: user.email || '',
        date:      body.date,
        startTime: body.startTime,
        endTime:   body.endTime,
        duration,
        type:      'match',
        matchId,
        status:    'confirmed',
        price:     field.price || 0,
        createdAt: new Date(),
      })

      // ── جلب كل المستخدمين ما عدا المنشئ ────────────────
      const allUsers = await db.collection('users')
        .find(
          { _id: { $ne: new ObjectId(body.userId) } },
          { projection: { _id: 1, email: 1, name: 1 } }
        ).toArray()

      // ── إشعارات داخلية bulk ─────────────────────────────
      if (allUsers.length > 0) {
        await db.collection('notifications').insertMany(
          allUsers.map(u => ({
            userId:    u._id.toString(),
            type:      'new_match',
            title:     '⚽ مباراة جديدة تحتاجك!',
            message:   `${user.name} أنشأ مباراة في ${field.name}`,
            subText:   `${body.date} — ${body.startTime} | ${field.location}`,
            matchId,
            relatedId: matchId,
            read:      false,
            createdAt: new Date(),
          }))
        )

        // ── إيميلات (non-blocking) ───────────────────────
        broadcastMatchEmails(
          allUsers.filter(u => u.email),
          {
            creatorName:   user.name,
            fieldName:     field.name,
            fieldLocation: field.location || '',
            date:          body.date,
            startTime:     body.startTime,
            endTime:       body.endTime,
            level:         body.level || 'متوسط',
            totalNeeded:   totalPlayers,
            matchId,
          }
        ).catch(err => console.error('Email error:', err))
      }

      // إشعار للمنشئ
      await db.collection('notifications').insertOne({
        userId:    body.userId,
        type:      'match_created',
        title:     '✅ تم إنشاء مباراتك',
        message:   `تم إنشاء مباراة في ${field.name} يوم ${body.date} الساعة ${body.startTime}`,
        relatedId: matchId,
        read:      false,
        createdAt: new Date(),
      })

      return NextResponse.json({
        success: true,
        message: 'تم إنشاء المباراة وإرسال إشعارات لجميع المستخدمين',
        matchId,
        type: 'match',
      }, { status: 201 })
    }

    // ══════════════════════════════════════════════════════
    // ✅ حجز عادي (لاعبين مكتملين أو بدون مباراة)
    // ══════════════════════════════════════════════════════
    const newBooking = {
      fieldId:       body.fieldId,
      fieldName:     field.name,
      fieldLocation: field.location,
      userId:        body.userId,
      userName:      user.name,
      userPhone:     user.phone || '',
      date:          body.date,
      startTime:     body.startTime,
      endTime:       body.endTime,
      duration,
      price:         field.price,
      totalPrice:    field.price * duration,
      totalPlayers:  totalPlayers > 0 ? totalPlayers : null,
      notes:         body.notes || '',
      status:        'confirmed',
      createdAt:     new Date(),
      updatedAt:     new Date(),
    }

    const result  = await db.collection('bookings').insertOne(newBooking)
    const bookingId = result.insertedId.toString()

    // إشعار تأكيد للمستخدم
    await db.collection('notifications').insertOne({
      userId:    body.userId,
      type:      'booking_confirmed',
      title:     '✅ تم تأكيد حجزك',
      message:   `تم تأكيد حجزك في ${field.name} يوم ${body.date} الساعة ${body.startTime}`,
      relatedId: bookingId,
      read:      false,
      createdAt: new Date(),
    })

    const saved = await db.collection('bookings').findOne({ _id: result.insertedId })
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحجز بنجاح',
      booking: {
        ...saved,
        _id:     saved?._id.toString(),
        fieldId: saved?.fieldId?.toString(),
        userId:  saved?.userId?.toString(),
      },
      type: 'booking',
    }, { status: 201 })

  } catch (error) {
    console.error('❌ POST /api/bookings:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في إنشاء الحجز' }, { status: 500 })
  }
}

// ══════════════════════════════════════════════════════════════
// PUT /api/bookings
// ══════════════════════════════════════════════════════════════
export async function PUT(request: Request) {
  try {
    const client = await clientPromise
    const db     = client.db('booking')
    const body   = await request.json()
    const { id, ...updateData } = body

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'معرف الحجز غير صالح' }, { status: 400 })
    }

    const result = await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'الحجز غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'تم تحديث الحجز بنجاح' })

  } catch (error) {
    console.error('❌ PUT /api/bookings:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في تحديث الحجز' }, { status: 500 })
  }
}

// ══════════════════════════════════════════════════════════════
// DELETE /api/bookings
// ══════════════════════════════════════════════════════════════
export async function DELETE(request: Request) {
  try {
    const client = await clientPromise
    const db     = client.db('booking')
    const { searchParams } = new URL(request.url)
    const id     = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: 'معرف الحجز غير صالح' }, { status: 400 })
    }

    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) })
    if (!booking) {
      return NextResponse.json({ success: false, error: 'الحجز غير موجود' }, { status: 404 })
    }
    if (booking.status === 'cancelled') {
      return NextResponse.json({ success: false, error: 'الحجز ملغي بالفعل' }, { status: 400 })
    }

    const adminUser = userId && ObjectId.isValid(userId)
      ? await db.collection('users').findOne({ _id: new ObjectId(userId) })
      : null

    // فحص 12 ساعة للمستخدمين العاديين
    if (adminUser?.role !== 'admin') {
      const bookingDate = new Date(booking.date)
      const [h] = booking.startTime.split(':')
      bookingDate.setHours(parseInt(h), 0, 0)
      if ((bookingDate.getTime() - Date.now()) / 3600000 < 12) {
        return NextResponse.json(
          { success: false, error: 'لا يمكن إلغاء الحجز قبل أقل من 12 ساعة' },
          { status: 400 }
        )
      }
    }

    await db.collection('bookings').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'cancelled', cancelledAt: new Date(), cancelledBy: adminUser?.role === 'admin' ? 'admin' : 'user' } }
    )

    await db.collection('notifications').insertOne({
      userId:    booking.userId,
      type:      'booking_cancelled',
      title:     adminUser?.role === 'admin' ? 'تم إلغاء حجزك بواسطة الإدارة' : 'تم إلغاء حجزك',
      message:   `تم إلغاء حجزك في ${booking.fieldName} يوم ${booking.date}`,
      relatedId: id,
      read:      false,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, message: 'تم إلغاء الحجز بنجاح' })

  } catch (error) {
    console.error('❌ DELETE /api/bookings:', error)
    return NextResponse.json({ success: false, error: 'حدث خطأ في إلغاء الحجز' }, { status: 500 })
  }
}

// ══════════════════════════════════════════════════════════════
// Helpers
// ══════════════════════════════════════════════════════════════

function calcHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  return ((eh * 60 + em) - (sh * 60 + sm)) / 60
}

async function weeklyLimitCheck(
  db: any, userId: string, bookingDate: string, newDuration: number
): Promise<{ allowed: boolean; message: string }> {

  const target    = new Date(bookingDate)
  const day       = target.getDay()
  const weekStart = new Date(target); weekStart.setDate(target.getDate() - day)
  const weekEnd   = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6)
  const ws = weekStart.toISOString().split('T')[0]
  const we = weekEnd.toISOString().split('T')[0]

  const [bookings, matches] = await Promise.all([
    db.collection('bookings').find({
      userId, date: { $gte: ws, $lte: we }, status: { $ne: 'cancelled' }
    }).toArray(),
    db.collection('matches').find({
      creatorId: userId, date: { $gte: ws, $lte: we }, status: { $ne: 'cancelled' }
    }).toArray(),
  ])

  const usedHours =
    bookings.reduce((s: number, b: any) => s + (b.duration || calcHours(b.startTime, b.endTime)), 0) +
    matches.reduce( (s: number, m: any) => s + (m.duration || calcHours(m.startTime, m.endTime)), 0)

  console.log('📊 Weekly limit:', { userId, ws, we, usedHours, newDuration })

  if (usedHours + newDuration > 3) {
    const remaining = Math.max(0, 3 - usedHours).toFixed(1)
    return {
      allowed: false,
      message:
        `⚠️ تجاوزت الحد الأسبوعي (3 ساعات)\n` +
        `• الساعات المستخدمة: ${usedHours.toFixed(1)} من 3\n` +
        `• المطلوب: ${newDuration} ساعة\n` +
        `• المتبقي: ${remaining} ساعة فقط`,
    }
  }

  return { allowed: true, message: '' }
}

async function broadcastMatchEmails(
  users: Array<{ email: string; name: string }>,
  match: {
    creatorName: string; fieldName: string; fieldLocation: string
    date: string; startTime: string; endTime: string
    level: string; totalNeeded: number; matchId: string
  }
) {
  if (!process.env.SMTP_USER) return

  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  for (const user of users) {
    try {
      await transporter.sendMail({
        from:    `"كورة بوك ⚽" <${process.env.SMTP_USER}>`,
        to:      user.email,
        subject: `⚽ مباراة جديدة تحتاجك — ${match.fieldName}`,
        html:    buildMatchEmailHTML({ ...match, userName: user.name, BASE_URL }),
      })
    } catch (err) {
      console.error(`Email failed for ${user.email}:`, err)
    }
  }
}

function buildMatchEmailHTML(p: {
  userName: string; creatorName: string; fieldName: string
  fieldLocation: string; date: string; startTime: string
  endTime: string; level: string; totalNeeded: number
  matchId: string; BASE_URL: string
}) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8">
<style>
  body{margin:0;padding:24px;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;direction:rtl}
  .card{max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .hdr{background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:32px;text-align:center;color:#fff}
  .hdr-icon{font-size:44px;margin-bottom:10px}
  .hdr h1{margin:0;font-size:22px;font-weight:700}
  .hdr p{margin:8px 0 0;opacity:.85;font-size:14px}
  .body{padding:28px}
  .row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px}
  .row:last-child{border:none}
  .lbl{color:#94a3b8;font-size:13px}
  .val{font-weight:600;color:#0f172a}
  .badge{display:inline-block;background:#dbeafe;color:#1d4ed8;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:600}
  .cta{display:block;margin:20px 0 0;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;text-decoration:none;padding:14px;border-radius:12px;text-align:center;font-size:15px;font-weight:700;box-shadow:0 4px 14px rgba(22,163,74,.3)}
  .footer{background:#f8fafc;padding:16px;text-align:center;color:#94a3b8;font-size:12px}
</style></head>
<body>
<div class="card">
  <div class="hdr">
    <div class="hdr-icon">⚽</div>
    <h1>مباراة جديدة تحتاجك!</h1>
    <p>مرحباً ${p.userName}، هناك مباراة تنتظر لاعبين</p>
  </div>
  <div class="body">
    <div class="row"><span class="lbl">المنشئ</span><span class="val">${p.creatorName}</span></div>
    <div class="row"><span class="lbl">الملعب</span><span class="val">${p.fieldName}</span></div>
    <div class="row"><span class="lbl">الموقع</span><span class="val">📍 ${p.fieldLocation}</span></div>
    <div class="row"><span class="lbl">التاريخ</span><span class="val">📅 ${p.date}</span></div>
    <div class="row"><span class="lbl">الوقت</span><span class="val">⏰ ${p.startTime} – ${p.endTime}</span></div>
    <div class="row"><span class="lbl">المستوى</span><span class="badge">${p.level}</span></div>
    <div class="row"><span class="lbl">اللاعبون المطلوبون</span><span class="val" style="color:#ef4444">👥 ${p.totalNeeded} لاعب</span></div>
    <a href="${p.BASE_URL}/matches/${p.matchId}" class="cta">انضم الآن ←</a>
  </div>
  <div class="footer">كورة بوك — <a href="${p.BASE_URL}/settings/notifications" style="color:#94a3b8">إلغاء الاشتراك</a></div>
</div>
</body></html>`
}