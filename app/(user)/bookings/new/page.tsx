// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { api } from '@/services/api'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Loader2, Calendar, Clock, MapPin, Users, ChevronRight, AlertCircle } from 'lucide-react'
// import { Alert, AlertDescription } from '@/components/ui/alert'

// export default function NewBookingPage() {
//   const router = useRouter()
  
//   // State for booking data from localStorage
//   const [pendingBooking, setPendingBooking] = useState<any>(null)
//   const [field, setField] = useState<any>(null)
//   const [user, setUser] = useState<any>(null)
  
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [totalPlayers, setTotalPlayers] = useState(10)
//   const [notes, setNotes] = useState('')
//   const [error, setError] = useState('')

//   useEffect(() => {
//     // جلب المستخدم من localStorage
//     const userStr = localStorage.getItem('user')
//     if (!userStr) {
//       router.push('/login?redirect=/bookings/new')
//       return
//     }
    
//     try {
//       const userData = JSON.parse(userStr)
//       setUser(userData)
//     } catch (e) {
//       router.push('/login')
//       return
//     }
    
//     // جلب بيانات الحجز من localStorage
//     const pending = localStorage.getItem('pendingBooking')
//     if (pending) {
//       try {
//         const data = JSON.parse(pending)
//         setPendingBooking(data)
//         loadFieldDetails(data.fieldId)
//       } catch (e) {
//         setError('بيانات الحجز غير صالحة')
//       }
//     } else {
//       router.push('/fields')
//     }
//   }, [])

//   async function loadFieldDetails(fieldId: string) {
//     try {
//       const data = await api.getField(fieldId)
//       setField(data.field)
//     } catch (err) {
//       setError('حدث خطأ في جلب بيانات الملعب')
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     setSubmitting(true)
//     setError('')

//     try {
//       if (!user) {
//         router.push('/login')
//         return
//       }

//       if (!pendingBooking) {
//         setError('بيانات الحجز غير موجودة')
//         return
//       }

//       // التحقق من صحة العدد
//       if (totalPlayers < 2) {
//         setError('عدد اللاعبين يجب أن يكون على الأقل 2')
//         return
//       }

//       const bookingData = {
//         fieldId: pendingBooking.fieldId,
//         userId: user._id || user.id,
//         userName: user.name,
//         date: pendingBooking.date,
//         startTime: pendingBooking.startTime,
//         endTime: pendingBooking.endTime,
//         duration: pendingBooking.duration,
//         totalPlayers: totalPlayers,
//         notes: notes
//       }

//       console.log('Sending booking:', bookingData)

//       // إرسال الحجز
//       const response = await api.createBooking(bookingData)
      
//       // مسح البيانات المؤقتة
//       localStorage.removeItem('pendingBooking')
      
//       // التوجيه للصفحة المناسبة
//       if (totalPlayers < 10) {
//         router.push('/matches?created=true&type=match')
//       } else {
//         router.push('/my-bookings?success=true&type=booking')
//       }
      
//     } catch (err: any) {
//       console.error('Booking error:', err)
//       setError(err.message || 'حدث خطأ في إنشاء الحجز')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">جاري تحميل بيانات الحجز...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 mb-4">يجب تسجيل الدخول أولاً</p>
//           <Link href="/login">
//             <Button>تسجيل الدخول</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   if (!pendingBooking || !field) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 mb-4">لا توجد بيانات حجز</p>
//           <Link href="/fields">
//             <Button>اختيار ملعب</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-3xl" dir="rtl">
//       {/* Breadcrumb */}
//       <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
//         <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
//         <ChevronRight className="w-4 h-4" />
//         <Link href="/fields" className="hover:text-blue-600">الملاعب</Link>
//         <ChevronRight className="w-4 h-4" />
//         <Link href={`/fields/${field._id}`} className="hover:text-blue-600">{field.name}</Link>
//         <ChevronRight className="w-4 h-4" />
//         <span className="text-gray-900 font-medium">تأكيد الحجز</span>
//       </div>

//       <h1 className="text-3xl font-bold mb-8">تأكيد الحجز</h1>

//       <div className="grid md:grid-cols-3 gap-8">
//         {/* Booking Summary */}
//         <div className="md:col-span-1">
//           <Card>
//             <CardHeader>
//               <CardTitle>ملخص الحجز</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <h3 className="font-bold mb-2">{field.name}</h3>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <MapPin className="w-4 h-4" />
//                   <span>{field.location}</span>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-sm">
//                   <Calendar className="w-4 h-4 text-gray-400" />
//                   <span>{new Date(pendingBooking.date).toLocaleDateString('ar-EG')}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                   <Clock className="w-4 h-4 text-gray-400" />
//                   <span>{pendingBooking.startTime} - {pendingBooking.endTime}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                   <span className="font-bold text-blue-600">
//                     {field.price} ج/ساعة
//                   </span>
//                   <span className="text-gray-400">×</span>
//                   <span>{pendingBooking.duration} ساعات</span>
//                 </div>
//               </div>

//               <div className="border-t pt-4">
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold">الإجمالي</span>
//                   <span className="text-2xl font-bold text-blue-600">
//                     {field.price * pendingBooking.duration} ج
//                   </span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Booking Form */}
//         <div className="md:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Users className="w-5 h-5 text-blue-600" />
//                 عدد الفريق
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {error && (
//                   <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertDescription>{error}</AlertDescription>
//                   </Alert>
//                 )}

//                 <div className="space-y-4">
//                   <Label htmlFor="totalPlayers">العدد الإجمالي للفريق (بما فيهم أنت)</Label>
//                   <div className="relative">
//                     <Users className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     <Input
//                       id="totalPlayers"
//                       type="number"
//                       min="2"
//                       max="50"
//                       placeholder="أدخل عدد الفريق"
//                       className="pr-12 h-12 text-lg text-center"
//                       value={totalPlayers}
//                       onChange={(e) => setTotalPlayers(parseInt(e.target.value) || 2)}
//                     />
//                   </div>
                  
//                   {/* معلومات إضافية */}
//                   <div className="bg-blue-50 p-4 rounded-lg space-y-2">
//                     <p className="text-sm flex items-center gap-2">
//                       <span className="font-bold text-blue-700">أنت:</span>
//                       <span>اللاعب الأول</span>
//                     </p>
//                     <p className="text-sm flex items-center gap-2">
//                       <span className="font-bold text-blue-700">مطلوب:</span>
//                       <span>{totalPlayers - 1} لاعبين إضافيين</span>
//                     </p>
//                   </div>

//                   {/* تنبيه حسب العدد */}
//                   {totalPlayers < 10 ? (
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//                       <p className="text-green-700 text-sm font-semibold mb-1">
//                         🎯 سيتم إنشاء مباراة ناقصة لاعبين
//                       </p>
//                       <p className="text-green-600 text-xs">
//                         المباراة ستظهر في قسم المباريات للجميع للانضمام
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
//                       <p className="text-purple-700 text-sm font-semibold mb-1">
//                         ✅ حجز عادي مكتمل
//                       </p>
//                       <p className="text-purple-600 text-xs">
//                         سيتم إضافة الحجز إلى حجوزاتك فقط
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex gap-4 pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="flex-1 h-12"
//                     onClick={() => router.back()}
//                   >
//                     رجوع
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="flex-1 h-12 bg-green-600 hover:bg-green-700"
//                     disabled={submitting}
//                   >
//                     {submitting ? (
//                       <div className="flex items-center gap-2">
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         جاري...
//                       </div>
//                     ) : (
//                       totalPlayers < 10 ? 'إنشاء مباراة' : 'تأكيد الحجز'
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }



'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Calendar, Clock, MapPin, Users, ChevronRight, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import toast from 'react-hot-toast'

export default function NewBookingPage() {
  const router = useRouter()
  
  const [pendingBooking, setPendingBooking] = useState<any>(null)
  const [field, setField] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [totalPlayers, setTotalPlayers] = useState(10)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [weeklyHours, setWeeklyHours] = useState({ booked: 0, remaining: 3 })

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/login?redirect=/bookings/new')
      return
    }
    
    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
      loadUserWeeklyHours(userData._id || userData.id)
    } catch (e) {
      router.push('/login')
      return
    }
    
    const pending = localStorage.getItem('pendingBooking')
    if (pending) {
      try {
        const data = JSON.parse(pending)
        setPendingBooking(data)
        loadFieldDetails(data.fieldId)
      } catch (e) {
        toast.error('بيانات الحجز غير صالحة')
      }
    } else {
      router.push('/fields')
    }
  }, [])

  async function loadUserWeeklyHours(userId: string) {
    try {
      const data = await api.getUserWeeklyHours(userId)
      setWeeklyHours({
        booked: data.bookedHours || 0,
        remaining: data.remainingHours || 3
      })
    } catch (err) {
      console.error('Error loading weekly hours:', err)
    }
  }

  async function loadFieldDetails(fieldId: string) {
    try {
      const data = await api.getField(fieldId)
      setField(data.field)
    } catch (err) {
      toast.error('حدث خطأ في جلب بيانات الملعب')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (!user) {
        router.push('/login')
        return
      }

      if (!pendingBooking) {
        toast.error('بيانات الحجز غير موجودة')
        return
      }

      if (totalPlayers < 2) {
        toast.error('عدد اللاعبين يجب أن يكون على الأقل 2')
        return
      }

      // التحقق من الساعات المتبقية
      if (pendingBooking.duration > weeklyHours.remaining) {
        toast.error(`لا يمكنك تجاوز 3 ساعات في الأسبوع. المتبقي: ${weeklyHours.remaining} ساعات`)
        return
      }

      const bookingData = {
        fieldId: pendingBooking.fieldId,
        userId: user._id || user.id,
        userName: user.name,
        date: pendingBooking.date,
        startTime: pendingBooking.startTime,
        endTime: pendingBooking.endTime,
        duration: pendingBooking.duration,
        totalPlayers: totalPlayers,
        notes: notes
      }

      const response = await api.createBooking(bookingData)
      
      localStorage.removeItem('pendingBooking')
      
      toast.success(
        totalPlayers < 10 
          ? 'تم إنشاء المباراة بنجاح!'
          : 'تم تأكيد الحجز بنجاح!'
      )
      
      if (totalPlayers < 10) {
        router.push('/matches?created=true&type=match')
      } else {
        router.push(`/bookings/${response.booking?._id}`)
      }
      
    } catch (err: any) {
      console.error('Booking error:', err)
      toast.error(err.message || 'حدث خطأ في إنشاء الحجز')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل بيانات الحجز...</p>
        </div>
      </div>
    )
  }

  if (!pendingBooking || !field) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">لا توجد بيانات حجز</p>
          <Link href="/fields">
            <Button>اختيار ملعب</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl" dir="rtl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/fields" className="hover:text-blue-600">الملاعب</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/fields/${field._id}`} className="hover:text-blue-600">{field.name}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">تأكيد الحجز</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">تأكيد الحجز</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Booking Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>ملخص الحجز</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold mb-2">{field.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{field.location}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(pendingBooking.date).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{pendingBooking.startTime} - {pendingBooking.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-blue-600">
                    {field.price} ج/ساعة
                  </span>
                  <span className="text-gray-400">×</span>
                  <span>{pendingBooking.duration} ساعات</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">الإجمالي</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {field.price * pendingBooking.duration} ج
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                عدد الفريق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Weekly Hours Progress */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-blue-700 font-semibold">
                      الساعات المتبقية هذا الأسبوع:
                    </span>
                    <span className="text-lg font-bold text-blue-700">
                      {weeklyHours.remaining} / 3
                    </span>
                  </div>
                  
                  <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${((3 - weeklyHours.remaining) / 3) * 100}%` }}
                    />
                  </div>
                  
                  <p className="text-xs text-blue-600 mt-2">
                    🔄 سيتم تجديد الحصة يوم الأحد القادم
                  </p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="totalPlayers">العدد الإجمالي للفريق (بما فيهم أنت)</Label>
                  <div className="relative">
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="totalPlayers"
                      type="number"
                      min="2"
                      max="50"
                      placeholder="أدخل عدد الفريق"
                      className="pr-12 h-12 text-lg text-center"
                      value={totalPlayers}
                      onChange={(e) => setTotalPlayers(parseInt(e.target.value) || 2)}
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm flex items-center gap-2">
                      <span className="font-bold text-blue-700">أنت:</span>
                      <span>اللاعب الأول</span>
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <span className="font-bold text-blue-700">مطلوب:</span>
                      <span>{totalPlayers - 1} لاعبين إضافيين</span>
                    </p>
                  </div>

                  {totalPlayers < 10 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-green-700 text-sm font-semibold mb-1">
                        🎯 سيتم إنشاء مباراة ناقصة لاعبين
                      </p>
                      <p className="text-green-600 text-xs">
                        المباراة ستظهر في قسم المباريات للجميع للانضمام
                      </p>
                    </div>
                  ) : (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="text-purple-700 text-sm font-semibold mb-1">
                        ✅ حجز عادي مكتمل
                      </p>
                      <p className="text-purple-600 text-xs">
                        سيتم إضافة الحجز إلى حجوزاتك فقط
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => router.back()}
                  >
                    رجوع
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                    disabled={submitting || pendingBooking.duration > weeklyHours.remaining}
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري...
                      </div>
                    ) : (
                      totalPlayers < 10 ? 'إنشاء مباراة' : 'تأكيد الحجز'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}