// // "use client"

// // import { useState } from "react"
// // import { Card, CardContent } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// // import {
// //   Users,
// //   MapPin,
// //   Calendar,
// //   Clock,
// //   Trophy,
// //   UserPlus,
// //   Check,
// // } from "lucide-react"
// // import Link from "next/link"

// // // بيانات تجريبية للمباريات
// // const mockMatches = [
// //   {
// //     id: 1,
// //     fieldName: "ملعب النادي الأهلي",
// //     fieldLocation: "الجزيرة",
// //     date: "الجمعة 25 فبراير 2025",
// //     startTime: "20:00",
// //     endTime: "23:00",
// //     playersNeeded: 8,
// //     playersJoined: 5,
// //     level: "متوسط",
// //     createdBy: "أحمد محمد",
// //     status: "open",
// //   },
// //   {
// //     id: 2,
// //     fieldName: "ملعب الزمالك",
// //     fieldLocation: "ميت عقبة",
// //     date: "السبت 26 فبراير 2025",
// //     startTime: "18:00",
// //     endTime: "21:00",
// //     playersNeeded: 10,
// //     playersJoined: 7,
// //     level: "مبتدئ",
// //     createdBy: "محمود علي",
// //     status: "open",
// //   },
// //   {
// //     id: 3,
// //     fieldName: "ملعب القاهرة الدولي",
// //     fieldLocation: "مدينة نصر",
// //     date: "الأحد 27 فبراير 2025",
// //     startTime: "21:00",
// //     endTime: "00:00",
// //     playersNeeded: 8,
// //     playersJoined: 8,
// //     level: "متقدم",
// //     createdBy: "خالد حسن",
// //     status: "full",
// //   },
// // ]

// // export default function MatchesPage() {
// //   const [matches, setMatches] = useState(mockMatches)

// //   const handleJoinMatch = (matchId: number) => {
// //     setMatches(prev =>
// //       prev.map(match =>
// //         match.id === matchId
// //           ? { ...match, playersJoined: match.playersJoined + 1 }
// //           : match
// //       )
// //     )
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       {/* Header */}
// //       <div className="mb-8">
// //         <h1 className="text-3xl md:text-4xl font-bold mb-2">مباريات ناقصة لاعبين</h1>
// //         <p className="text-gray-600">
// //           انضم لمباراة محتاجة لاعبين ولعب مع ناس جديدة
// //         </p>
// //       </div>

// //       {/* Filters */}
// //       <div className="flex flex-wrap gap-4 mb-6">
// //         <Button variant="outline" size="sm">كل المستويات</Button>
// //         <Button variant="outline" size="sm">مبتدئ</Button>
// //         <Button variant="outline" size="sm">متوسط</Button>
// //         <Button variant="outline" size="sm">متقدم</Button>
// //       </div>

// //       {/* Matches Grid */}
// //       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {matches.map((match) => (
// //           <Card key={match.id} className="hover:shadow-lg transition overflow-hidden">
// //             <div className="h-2 bg-gradient-to-l from-blue-600 to-green-600" />
// //             <CardContent className="p-6">
// //               <div className="flex justify-between items-start mb-4">
// //                 <h3 className="text-xl font-bold">{match.fieldName}</h3>
// //                 <Badge variant={match.status === "full" ? "secondary" : "success"}>
// //                   {match.status === "full" ? "مكتمل" : "مفتوح"}
// //                 </Badge>
// //               </div>

// //               <div className="space-y-3 mb-4">
// //                 <div className="flex items-center gap-2 text-gray-600">
// //                   <MapPin className="w-4 h-4" />
// //                   <span className="text-sm">{match.fieldLocation}</span>
// //                 </div>
// //                 <div className="flex items-center gap-2 text-gray-600">
// //                   <Calendar className="w-4 h-4" />
// //                   <span className="text-sm">{match.date}</span>
// //                 </div>
// //                 <div className="flex items-center gap-2 text-gray-600">
// //                   <Clock className="w-4 h-4" />
// //                   <span className="text-sm">{match.startTime} - {match.endTime}</span>
// //                 </div>
// //                 <div className="flex items-center gap-2 text-gray-600">
// //                   <Trophy className="w-4 h-4" />
// //                   <span className="text-sm">المستوى: {match.level}</span>
// //                 </div>
// //               </div>

// //               {/* Players Progress */}
// //               <div className="mb-4">
// //                 <div className="flex justify-between text-sm mb-1">
// //                   <span>اللاعبون</span>
// //                   <span className="font-medium">
// //                     {match.playersJoined}/{match.playersNeeded}
// //                   </span>
// //                 </div>
// //                 <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
// //                   <div
// //                     className="h-full bg-blue-600"
// //                     style={{
// //                       width: `${(match.playersJoined / match.playersNeeded) * 100}%`,
// //                     }}
// //                   />
// //                 </div>
// //               </div>

// //               {/* Created By */}
// //               <p className="text-sm text-gray-500 mb-4">
// //                 بواسطة: {match.createdBy}
// //               </p>

// //               {/* Join Button */}
// //               {match.status !== "full" && (
// //                 <Button
// //                   className="w-full gap-2"
// //                   onClick={() => handleJoinMatch(match.id)}
// //                   disabled={match.playersJoined >= match.playersNeeded}
// //                 >
// //                   <UserPlus className="w-4 h-4" />
// //                   انضم للمباراة
// //                 </Button>
// //               )}

// //               {match.status === "full" && (
// //                 <Button className="w-full" variant="outline" disabled>
// //                   <Check className="w-4 h-4 ml-2" />
// //                   اكتمل العدد
// //                 </Button>
// //               )}
// //             </CardContent>
// //           </Card>
// //         ))}
// //       </div>

// //       {/* Create Match CTA */}
// //       <div className="mt-12 text-center">
// //         <Card className="bg-gradient-to-l from-blue-600 to-green-600 text-white">
// //           <CardContent className="p-8">
// //             <h2 className="text-2xl font-bold mb-4">مش لاقي ناس تلعب معاك؟</h2>
// //             <p className="mb-6 opacity-90">
// //               اعمل مباراة جديدة وخلي الناس تنضم ليك
// //             </p>
// //             <Link href="/bookings/new?openMatch=true">
// //               <Button size="lg" variant="secondary">
// //                 إنشاء مباراة جديدة
// //               </Button>
// //             </Link>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </div>
// //   )
// // }

    

// // 'use client'

// // import { useEffect, useState } from 'react'
// // import { useRouter } from 'next/navigation'
// // import { api } from '@/services/api'
// // import { Button } from '@/components/ui/button'
// // import { Card, CardContent } from '@/components/ui/card'
// // import { Badge } from '@/components/ui/badge'
// // import { 
// //   MapPin, Calendar, Clock, Users, UserPlus, 
// //   Check, Loader2, Trophy 
// // } from 'lucide-react'
// // import Link from 'next/link'

// // export default function MatchesPage() {
// //   const router = useRouter()
// //   const [matches, setMatches] = useState<any[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [user, setUser] = useState<any>(null)
// //   const [joiningId, setJoiningId] = useState<string | null>(null)

// //   useEffect(() => {
// //     const userStr = localStorage.getItem('user')
// //     if (userStr) {
// //       try {
// //         const userData = JSON.parse(userStr)
// //         console.log('👤 Current user:', userData)
// //         setUser(userData)
// //       } catch (e) {
// //         console.error('Error parsing user:', e)
// //       }
// //     }
// //     loadMatches()
// //   }, [])

// //  // في دالة loadMatches
// // async function loadMatches() {
// //   try {
// //     setLoading(true)
// //     const data = await api.getMatches()
// //     console.log('📊 Matches loaded:', data.matches.map((m: any) => ({
// //       id: m._id,
// //       field: m.fieldName,
// //       status: m.status,
// //       players: `${m.players?.length || 0}/${m.totalNeeded}`,
// //       isOpen: m.status === 'open'
// //     })))
// //     setMatches(data.matches || [])
// //   } catch (error) {
// //     console.error('Error loading matches:', error)
// //   } finally {
// //     setLoading(false)
// //   }
// // }

// //   // ✅ دالة الانضمام الصحيحة
// //   async function handleJoinMatch(matchId: string) {
// //     if (!user) {
// //       alert('يجب تسجيل الدخول أولاً')
// //       return
// //     }

// //     setJoiningId(matchId)
    
// //     try {
// //       const userId = user._id || user.id
// //       console.log('🎯 Attempting to join:', { matchId, userId })
      
// //       const response = await api.joinMatch(matchId, userId)
// //       console.log('✅ Join response:', response)
      
// //       alert(response.message || 'تم إرسال طلب الانضمام بنجاح')
// //       await loadMatches() // إعادة تحميل المباريات
      
// //     } catch (err: any) {
// //       console.error('❌ Join error:', err)
// //       alert(err.message || 'حدث خطأ في الانضمام للمباراة')
// //     } finally {
// //       setJoiningId(null)
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="flex justify-between items-center mb-8">
// //         <h1 className="text-3xl font-bold">المباريات الناقصة لاعبين</h1>
// //         <Link href="/fields">
// //           <Button className="bg-green-600 hover:bg-green-700">
// //             إنشاء مباراة جديدة
// //           </Button>
// //         </Link>
// //       </div>

// //       {matches.length === 0 ? (
// //         <div className="text-center py-12">
// //           <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-400" />
// //           <p className="text-gray-600">لا توجد مباريات حالياً</p>
// //         </div>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {matches.map((match) => {
// //             const isJoined = match.players?.some(
// //               (p: any) => p.userId === (user?._id || user?.id)
// //             )
// //             const hasRequested = match.pendingRequests?.some(
// //               (r: any) => r.userId === (user?._id || user?.id)
// //             )
// //             const isFull = match.players?.length >= match.totalNeeded

// //             return (
// //               <Card key={match._id} className="hover:shadow-lg transition">
// //                 <CardContent className="p-6">
// //                   <h3 className="text-xl font-bold mb-2">{match.fieldName}</h3>
                  
// //                   <div className="space-y-2 mb-4 text-gray-600">
// //                     <div className="flex items-center gap-2">
// //                       <MapPin className="w-4 h-4" />
// //                       <span className="text-sm">{match.fieldLocation}</span>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       <Calendar className="w-4 h-4" />
// //                       <span className="text-sm">
// //                         {new Date(match.date).toLocaleDateString('ar-EG')}
// //                       </span>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       <Clock className="w-4 h-4" />
// //                       <span className="text-sm">{match.startTime}</span>
// //                     </div>
// //                   </div>

// //                   <div className="mb-4">
// //                     <div className="flex justify-between text-sm mb-1">
// //                       <span>اللاعبون</span>
// //                       <span className="font-medium">
// //                         {match.players?.length || 0}/{match.totalNeeded}
// //                       </span>
// //                     </div>
// //                     <div className="h-2 bg-gray-200 rounded-full">
// //                       <div 
// //                         className="h-full bg-blue-600 rounded-full"
// //                         style={{ 
// //                           width: `${((match.players?.length || 0) / match.totalNeeded) * 100}%` 
// //                         }}
// //                       />
// //                     </div>
// //                   </div>

// //                   <Button
// //                     onClick={() => handleJoinMatch(match._id)}
// //                     disabled={!user || isJoined || hasRequested || isFull || joiningId === match._id}
// //                     className="w-full"
// //                     variant={isJoined || hasRequested || isFull ? "outline" : "default"}
// //                   >
// //                     {joiningId === match._id ? (
// //                       <Loader2 className="w-4 h-4 animate-spin ml-2" />
// //                     ) : isJoined ? (
// //                       <>
// //                         <Check className="w-4 h-4 ml-2" />
// //                         أنت منضم
// //                       </>
// //                     ) : hasRequested ? (
// //                       'طلب معلق'
// //                     ) : isFull ? (
// //                       'اكتمل العدد'
// //                     ) : (
// //                       <>
// //                         <UserPlus className="w-4 h-4 ml-2" />
// //                         طلب انضمام
// //                       </>
// //                     )}
// //                   </Button>
// //                 </CardContent>
// //               </Card>
// //             )
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }



// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { api } from '@/services/api'
// import Link from 'next/link'
// import {
//   Calendar, Users, UserPlus, Check,
//   Loader2, Trophy, ChevronDown, SlidersHorizontal,
//   Plus, ChevronRight, Timer, AlertCircle, MapPin, Clock
// } from 'lucide-react'

// // ── helpers ───────────────────────────────────────────────────
// function toLocalDateStr(d: Date) {
//   return [
//     d.getFullYear(),
//     String(d.getMonth() + 1).padStart(2, '0'),
//     String(d.getDate()).padStart(2, '0'),
//   ].join('-')
// }

// function formatMatchDate(dateStr: string) {
//   const d = new Date(dateStr)
//   return d.toLocaleDateString('ar-EG', {
//     weekday: 'long', day: 'numeric', month: 'long'
//   })
// }

// function getDateLabel(dateStr: string) {
//   const today = toLocalDateStr(new Date())
//   const tom   = new Date(); tom.setDate(tom.getDate() + 1)
//   if (dateStr === today)             return '• اليوم'
//   if (dateStr === toLocalDateStr(tom)) return '• غداً'
//   return ''
// }

// function groupByDate(matches: any[]) {
//   const map: Record<string, any[]> = {}
//   matches.forEach(m => {
//     if (!map[m.date]) map[m.date] = []
//     map[m.date].push(m)
//   })
//   return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
// }

// function initials(name: string) {
//   return name?.split(' ').slice(0, 2).map((w: string) => w[0]).join('') || '?'
// }

// // ── colors (من الكود الأصلي) ──────────────────────────────────
// const C = {
//   blue:        '#2563eb',   // blue-600
//   blueBg:      '#eff6ff',   // blue-50
//   blueBorder:  '#bfdbfe',   // blue-200
//   green:       '#16a34a',   // green-600
//   greenBg:     '#f0fdf4',   // green-50
//   greenBorder: '#bbf7d0',   // green-200
//   greenHover:  '#15803d',   // green-700
//   gray:        '#6b7280',   // gray-500
//   grayBg:      '#f9fafb',   // gray-50
//   grayBorder:  '#e5e7eb',   // gray-200
//   grayLight:   '#f3f4f6',   // gray-100
//   text:        '#111827',   // gray-900
//   textMuted:   '#6b7280',   // gray-500
//   textLight:   '#9ca3af',   // gray-400
//   orange:      '#c2410c',   // orange-700
//   orangeBg:    '#fff7ed',
//   orangeBorder:'#fed7aa',
//   red:         '#dc2626',
//   white:       '#ffffff',
//   bg:          '#f9fafb',
// }

// // ── button helper ─────────────────────────────────────────────
// function btnStyle(bg: string, border: string, color: string, clickable = false) {
//   return {
//     background: bg,
//     border: `1px solid ${border}`,
//     borderRadius: 20,
//     padding: '6px 14px',
//     fontSize: 13,
//     fontWeight: 600,
//     color,
//     display:     'inline-flex' as const,
//     alignItems:  'center' as const,
//     gap: 5,
//     cursor:      clickable ? 'pointer' : 'default',
//     fontFamily:  'inherit',
//     opacity:     clickable ? 1 : 0.75,
//     transition:  'all .15s',
//     whiteSpace:  'nowrap' as const,
//     // ✅ أيقونة على اليمين في RTL
//     flexDirection: 'row' as const,
//   }
// }

// // ─────────────────────────────────────────────────────────────
// export default function MatchesPage() {
//   const router = useRouter()
//   const [matches,     setMatches]     = useState<any[]>([])
//   const [loading,     setLoading]     = useState(true)
//   const [user,        setUser]        = useState<any>(null)
//   const [joiningId,   setJoiningId]   = useState<string | null>(null)
//   const [filterOpen,  setFilterOpen]  = useState(false)
//   const [levelFilter, setLevelFilter] = useState('all')
//   const [feedback,    setFeedback]    = useState<{ id: string; msg: string; ok: boolean } | null>(null)

//   useEffect(() => {
//     const s = localStorage.getItem('user')
//     if (s) { try { setUser(JSON.parse(s)) } catch {} }
//     loadMatches()
//   }, [])

//   async function loadMatches() {
//     try {
//       setLoading(true)
//       const data = await api.getMatches()
//       setMatches(data.matches || [])
//     } catch (e) {
//       console.error(e)
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function handleJoinMatch(matchId: string) {
//     if (!user) { router.push('/login?redirect=/matches'); return }
//     setJoiningId(matchId)
//     try {
//       const res = await api.joinMatch(matchId, user._id || user.id)
//       setFeedback({ id: matchId, msg: res.message || 'تم إرسال طلب الانضمام', ok: true })
//       await loadMatches()
//     } catch (err: any) {
//       setFeedback({ id: matchId, msg: err.message || 'حدث خطأ', ok: false })
//     } finally {
//       setJoiningId(null)
//       setTimeout(() => setFeedback(null), 3000)
//     }
//   }

//   const filtered = matches.filter(m => {
//     if (m.status === 'cancelled') return false
//     if (levelFilter !== 'all' && m.level !== levelFilter) return false
//     return true
//   })

//   const grouped = groupByDate(filtered)

//   // ── JSX ───────────────────────────────────────────────────
//   return (
//     <div
//       dir="rtl"
//       style={{
//         background: C.bg,
//         minHeight: '100vh',
//         color: C.text,
//         fontFamily: "'Cairo', 'Tajawal', sans-serif",
//       }}
//     >

//       {/* ══ HEADER ══ */}
//       <div style={{
//         background: C.white,
//         borderBottom: `1px solid ${C.grayBorder}`,
//         padding: '14px 20px',
//         position: 'sticky', top: 0, zIndex: 50,
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//       }}>
//         {/* ⚽ يمين */}
//         <div style={{
//           width: 38, height: 38, borderRadius: '50%',
//           background: C.grayLight, border: `1px solid ${C.grayBorder}`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           fontSize: 18,
//         }}>⚽</div>

//         {/* عنوان وسط */}
//         <div style={{ textAlign: 'center' }}>
//           <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.text }}>
//             المباريات المفتوحة
//           </h1>
//           <p style={{ margin: 0, fontSize: 11, color: C.textMuted, marginTop: 2 }}>
//             ابحث عن مباريات أو أنشئ مباراة ودية
//           </p>
//         </div>

//         {/* زر إنشاء — يسار */}
//         <Link href="/fields" style={{ textDecoration: 'none' }}>
//           <button style={{
//             background: C.green, color: C.white,
//             border: 'none', borderRadius: 20,
//             padding: '7px 14px',
//             display: 'inline-flex', alignItems: 'center',
//             flexDirection: 'row',   // ✅ أيقونة على اليمين
//             gap: 5,
//             fontSize: 13, fontWeight: 700, cursor: 'pointer',
//             fontFamily: 'inherit',
//           }}>
//             <Plus size={14} />
//             إنشاء
//           </button>
//         </Link>
//       </div>

//       {/* ══ FILTER BAR ══ */}
//       <div style={{ padding: '10px 16px' }}>
//         <button
//           onClick={() => setFilterOpen(!filterOpen)}
//           style={{
//             width: '100%', background: C.white,
//             border: `1px solid ${C.grayBorder}`, borderRadius: 12,
//             padding: '10px 14px', color: C.text,
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
//           }}
//         >
//           {/* يمين: سهم */}
//           <ChevronDown
//             size={16} color={C.gray}
//             style={{ transform: filterOpen ? 'rotate(180deg)' : 'none', transition: '.2s', flexShrink: 0 }}
//           />
//           {/* يسار: أيقونة + نص */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
//             <span style={{ color: C.textMuted }}>الفلاتر</span>
//             <SlidersHorizontal size={15} color={C.gray} />
//           </div>
//         </button>

//         {filterOpen && (
//           <div style={{
//             background: C.white, border: `1px solid ${C.grayBorder}`,
//             borderTop: 'none', borderRadius: '0 0 12px 12px',
//             padding: '10px 14px',
//             display: 'flex', gap: 8, flexWrap: 'wrap',
//             justifyContent: 'flex-start',   // ✅ من اليسار (لأن RTL)
//           }}>
//             {[
//               { val: 'all',   label: 'الكل'   },
//               { val: 'مبتدئ', label: 'مبتدئ'  },
//               { val: 'متوسط', label: 'متوسط'  },
//               { val: 'محترف', label: 'محترف'  },
//             ].map(({ val, label }) => (
//               <button
//                 key={val}
//                 onClick={() => setLevelFilter(val)}
//                 style={{
//                   padding: '5px 14px', borderRadius: 20, fontSize: 13,
//                   fontFamily: 'inherit', cursor: 'pointer',
//                   border: `1px solid ${levelFilter === val ? C.blue : C.grayBorder}`,
//                   background: levelFilter === val ? C.blueBg : C.white,
//                   color: levelFilter === val ? C.blue : C.textMuted,
//                   fontWeight: levelFilter === val ? 700 : 400,
//                   transition: '.15s',
//                 }}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ══ CONTENT ══ */}
//       <div style={{ padding: '0 16px 24px' }}>

//         {/* Loading */}
//         {loading && (
//           <div style={{ textAlign: 'center', padding: '60px 0' }}>
//             <Loader2 size={32} color={C.blue} style={{ animation: 'spin 1s linear infinite', display: 'block', margin: '0 auto' }} />
//             <p style={{ color: C.textMuted, marginTop: 12, fontSize: 14 }}>جاري التحميل...</p>
//           </div>
//         )}

//         {/* Empty */}
//         {!loading && grouped.length === 0 && (
//           <div style={{ textAlign: 'center', padding: '80px 0' }}>
//             <Trophy size={48} color={C.grayBorder} style={{ margin: '0 auto 16px', display: 'block' }} />
//             <p style={{ color: C.textMuted, fontSize: 15 }}>لا توجد مباريات حالياً</p>
//             <Link href="/fields" style={{ textDecoration: 'none' }}>
//               <button style={{
//                 marginTop: 16, background: C.green, color: C.white,
//                 border: 'none', borderRadius: 12, padding: '10px 24px',
//                 fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
//               }}>
//                 أنشئ مباراة الآن
//               </button>
//             </Link>
//           </div>
//         )}

//         {/* Grouped matches */}
//         {!loading && grouped.map(([dateStr, dayMatches]) => (
//           <div key={dateStr} style={{ marginBottom: 6 }}>

//             {/* ── Date header ── */}
//             <div style={{
//               display: 'flex', alignItems: 'center',
//               justifyContent: 'space-between',
//               padding: '14px 2px 8px',
//             }}>
//               {/* يمين: التاريخ + تمييز اليوم */}
//               <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                 {getDateLabel(dateStr) && (
//                   <span style={{ fontSize: 13, color: C.blue, fontWeight: 700 }}>
//                     {getDateLabel(dateStr)}
//                   </span>
//                 )}
//                 <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
//                   {formatMatchDate(dateStr)}
//                 </span>
//               </div>

//               {/* يسار: عداد المباريات */}
//               <div style={{
//                 background: C.white, border: `1px solid ${C.grayBorder}`,
//                 borderRadius: 8, padding: '3px 10px',
//                 display: 'inline-flex', alignItems: 'center', gap: 5,
//               }}>
//                 <span style={{ fontSize: 12, color: C.textMuted }}>{dayMatches.length} مباريات</span>
//                 <Calendar size={12} color={C.blue} />
//               </div>
//             </div>

//             {/* ── Match cards ── */}
//             {dayMatches.map(match => {
//               const uid          = user?._id || user?.id
//               const isCreator    = match.creatorId === uid
//               const isJoined     = match.players?.some((p: any) => p.userId === uid)
//               const hasRequested = match.pendingRequests?.some(
//                 (r: any) => r.userId === uid && r.status === 'pending'
//               )
//               const isFull       = (match.players?.length || 0) >= match.totalNeeded
//               const pendingCount = match.pendingRequests?.filter(
//                 (r: any) => r.status === 'pending'
//               ).length || 0
//               const progress     = Math.min(100, ((match.players?.length || 0) / match.totalNeeded) * 100)
//               const thisFeedback = feedback?.id === match._id ? feedback : null

//               return (
//                 <div
//                   key={match._id}
//                   style={{
//                     background: C.white,
//                     border: `1px solid ${C.grayBorder}`,
//                     borderRadius: 16,
//                     marginBottom: 10,
//                     overflow: 'hidden',
//                     boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
//                   }}
//                 >
//                   {/* ── صف المنشئ ── */}
//                   <div style={{
//                     display: 'flex', alignItems: 'center',
//                     justifyContent: 'space-between',
//                     padding: '14px 14px 8px',
//                   }}>
//                     {/* يمين: معلومات المنشئ + أفاتار */}
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                       {/* أفاتار */}
//                       <div style={{
//                         width: 42, height: 42, borderRadius: '50%',
//                         background: C.blueBg, border: `1px solid ${C.blueBorder}`,
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         fontSize: 14, fontWeight: 800, color: C.blue,
//                         flexShrink: 0,
//                       }}>
//                         {initials(match.creatorName)}
//                       </div>
//                       <div style={{ textAlign: 'right' }}>
//                         <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>
//                           {match.creatorName}
//                         </p>
//                         <p style={{ margin: 0, fontSize: 11, color: C.textLight }}>
//                           {match.previousMatches || 0} مباريات سابقة
//                         </p>
//                       </div>
//                     </div>

//                     {/* يسار: سهم للتفاصيل */}
//                     <Link href={`/matches/${match._id}`} style={{ textDecoration: 'none' }}>
//                       <div style={{
//                         width: 28, height: 28, borderRadius: '50%',
//                         background: C.grayLight, border: `1px solid ${C.grayBorder}`,
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         cursor: 'pointer',
//                       }}>
//                         <ChevronRight size={14} color={C.gray} />
//                       </div>
//                     </Link>
//                   </div>

//                   {/* ── اسم الفريق + badge الموقع ── */}
//                   <div style={{
//                     padding: '0 14px 8px',
//                     display: 'flex', alignItems: 'center',
//                     justifyContent: 'space-between',
//                   }}>
//                     {/* يمين: اسم الفريق */}
//                     <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.text }}>
//                       {match.teamName || match.fieldName}
//                     </h3>
//                     {/* يسار: badge الموقع */}
//                     {match.fieldLocation && (
//                       <span style={{
//                         background: C.grayLight, border: `1px solid ${C.grayBorder}`,
//                         borderRadius: 8, padding: '3px 9px',
//                         fontSize: 12, color: C.textMuted,
//                         display: 'inline-flex', alignItems: 'center', gap: 4,
//                       }}>
//                         <MapPin size={11} color={C.textMuted} />
//                         {match.fieldLocation.split('،')[0] || match.fieldLocation}
//                       </span>
//                     )}
//                   </div>

//                   {/* ── chip التاريخ والوقت ── */}
//                   <div style={{ padding: '0 14px 10px', display: 'flex', justifyContent: 'flex-start' }}>
//                     <div style={{
//                       display: 'inline-flex', alignItems: 'center', gap: 6,
//                       background: C.grayLight, border: `1px solid ${C.grayBorder}`,
//                       borderRadius: 10, padding: '5px 11px',
//                       flexDirection: 'row',  // ✅ أيقونة على اليمين
//                     }}>
//                       <Calendar size={12} color={C.textMuted} />
//                       <span style={{ fontSize: 12, color: C.textMuted }}>
//                         {new Date(match.date).toLocaleDateString('ar-EG', {
//                           weekday: 'short', day: 'numeric', month: 'short'
//                         })}
//                       </span>
//                       <span style={{ fontSize: 12, color: C.grayBorder }}>|</span>
//                       <Clock size={12} color={C.textMuted} />
//                       <span style={{ fontSize: 12, color: C.textMuted, direction: 'ltr' }}>
//                         {match.startTime} – {match.endTime}
//                       </span>
//                     </div>
//                   </div>

//                   {/* ── progress bar ── */}
//                   <div style={{ padding: '0 14px 6px' }}>
//                     <div style={{
//                       height: 4, background: C.grayLight,
//                       borderRadius: 99, overflow: 'hidden',
//                     }}>
//                       <div style={{
//                         height: '100%',
//                         width: `${progress}%`,
//                         background: isFull
//                           ? C.gray
//                           : `linear-gradient(90deg, ${C.blue}, #60a5fa)`,
//                         borderRadius: 99,
//                         transition: 'width .4s ease',
//                       }} />
//                     </div>
//                   </div>

//                   {/* ── صف أسفل: معلق + متبقي + زر ── */}
//                   <div style={{
//                     padding: '6px 14px 13px',
//                     display: 'flex', alignItems: 'center',
//                     justifyContent: 'space-between', gap: 8,
//                   }}>
//                     {/* يمين: عدد في الانتظار + متبقي */}
//                     <div style={{
//                       display: 'flex', alignItems: 'center', gap: 8,
//                       flexDirection: 'row',
//                     }}>
//                       {pendingCount > 0 && (
//                         <span style={{
//                           fontSize: 12, color: '#d97706', fontWeight: 600,
//                           background: '#fffbeb', border: '1px solid #fde68a',
//                           borderRadius: 12, padding: '1px 8px',
//                         }}>
//                           {pendingCount} في الانتظار
//                         </span>
//                       )}
//                       <span style={{
//                         fontSize: 12,
//                         color: isFull ? C.red : C.textMuted,
//                         fontWeight: isFull ? 600 : 400,
//                       }}>
//                         {match.players?.length || 0}/{match.totalNeeded} متبقي
//                       </span>
//                     </div>

//                     {/* يسار: زر الانضمام */}
//                     <div>
//                       {thisFeedback ? (
//                         <span style={{
//                           fontSize: 12, fontWeight: 600,
//                           color: thisFeedback.ok ? C.green : C.red,
//                           display: 'inline-flex', alignItems: 'center', gap: 4,
//                         }}>
//                           {thisFeedback.ok
//                             ? <Check size={13} />
//                             : <AlertCircle size={13} />}
//                           {thisFeedback.msg}
//                         </span>
//                       ) : isCreator ? (
//                         <Link href={`/matches/${match._id}/requests`} style={{ textDecoration: 'none' }}>
//                           <button style={btnStyle(C.blueBg, C.blueBorder, C.blue, true)}>
//                             <Users size={13} />
//                             إدارة ({pendingCount})
//                           </button>
//                         </Link>
//                       ) : isJoined ? (
//                         <button style={btnStyle(C.greenBg, C.greenBorder, C.green)} disabled>
//                           <Check size={13} />
//                           منضم ✓
//                         </button>
//                       ) : hasRequested ? (
//                         <button style={btnStyle(C.orangeBg, C.orangeBorder, C.orange)} disabled>
//                           <Timer size={13} />
//                           طلب معلق
//                         </button>
//                       ) : isFull ? (
//                         <button style={btnStyle(C.grayLight, C.grayBorder, C.gray)} disabled>
//                           اكتمل العدد
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleJoinMatch(match._id)}
//                           disabled={joiningId === match._id}
//                           style={btnStyle(C.green, C.green, C.white, true)}
//                         >
//                           {joiningId === match._id
//                             ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
//                             : <UserPlus size={13} />}
//                           طلب انضمام
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         ))}
//       </div>

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg) } }
//         * { box-sizing: border-box }
//       `}</style>
//     </div>
//   )
// }

// 'use client'

// import { useEffect, useState, useRef } from 'react'
// import { useRouter } from 'next/navigation'
// import { api } from '@/services/api'
// import Link from 'next/link'
// import {
//   Calendar, Users, UserPlus, Check, Loader2, Trophy,
//   SlidersHorizontal, Plus, ChevronRight, ChevronLeft,
//   Timer, AlertCircle, MapPin, Clock, X, Filter
// } from 'lucide-react'

// // ── helpers ───────────────────────────────────────────────────
// function toLocalDateStr(d: Date) {
//   return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-')
// }
// function formatMatchDate(dateStr: string) {
//   return new Date(dateStr).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })
// }
// function getDateLabel(dateStr: string) {
//   const today = toLocalDateStr(new Date())
//   const tom = new Date(); tom.setDate(tom.getDate()+1)
//   if (dateStr === today) return 'اليوم'
//   if (dateStr === toLocalDateStr(tom)) return 'غداً'
//   return ''
// }
// function groupByDate(matches: any[]) {
//   const map: Record<string, any[]> = {}
//   matches.forEach(m => { if(!map[m.date]) map[m.date]=[]; map[m.date].push(m) })
//   return Object.entries(map).sort(([a],[b]) => a.localeCompare(b))
// }
// function initials(name: string) {
//   return name?.split(' ').slice(0,2).map((w:string)=>w[0]).join('') || '?'
// }
// function daysUntil(dateStr: string) {
//   const diff = Math.ceil((new Date(dateStr).getTime() - new Date().setHours(0,0,0,0)) / 86400000)
//   if (diff === 0) return 'اليوم'
//   if (diff === 1) return 'غداً'
//   if (diff < 0)  return 'انتهت'
//   return `بعد ${diff} أيام`
// }

// // ── color palette ──────────────────────────────────────────────
// const C = {
//   blue:'#2563eb', blueBg:'#eff6ff', blueBorder:'#bfdbfe',
//   green:'#16a34a', greenBg:'#f0fdf4', greenBorder:'#bbf7d0', white:'#ffffff',
//   gray:'#6b7280', grayBg:'#f9fafb', grayBorder:'#e5e7eb', grayLight:'#f3f4f6',
//   text:'#111827', textMuted:'#6b7280', textLight:'#9ca3af',
//   orange:'#c2410c', orangeBg:'#fff7ed', orangeBorder:'#fed7aa',
//   red:'#dc2626', bg:'#f9fafb',
// }

// function btnStyle(bg:string, border:string, color:string, clickable=false) {
//   return {
//     background:bg, border:`1px solid ${border}`, borderRadius:20,
//     padding:'6px 14px', fontSize:13, fontWeight:600, color,
//     display:'inline-flex' as const, alignItems:'center' as const, gap:5,
//     cursor: clickable ? 'pointer' : 'default',
//     fontFamily:'inherit', opacity: clickable ? 1 : 0.75,
//     transition:'all .15s', whiteSpace:'nowrap' as const, flexDirection:'row' as const,
//   }
// }

// // ── filter chip ───────────────────────────────────────────────
// function Chip({ label, active, onClick }: { label:string; active:boolean; onClick:()=>void }) {
//   return (
//     <button onClick={onClick} style={{
//       padding:'5px 14px', borderRadius:20, fontSize:13,
//       fontFamily:'inherit', cursor:'pointer', flexShrink:0,
//       border:`1px solid ${active ? C.blue : C.grayBorder}`,
//       background: active ? C.blueBg : C.white,
//       color: active ? C.blue : C.textMuted,
//       fontWeight: active ? 700 : 400, transition:'.15s',
//     }}>
//       {label}
//     </button>
//   )
// }

// // ─────────────────────────────────────────────────────────────
// export default function MatchesPage() {
//   const router = useRouter()
//   const sliderRef = useRef<HTMLDivElement>(null)

//   const [matches,      setMatches]      = useState<any[]>([])
//   const [myMatches,    setMyMatches]    = useState<any[]>([])   // مبارياتي (slider)
//   const [loading,      setLoading]      = useState(true)
//   const [user,         setUser]         = useState<any>(null)
//   const [joiningId,    setJoiningId]    = useState<string|null>(null)
//   const [feedback,     setFeedback]     = useState<{id:string;msg:string;ok:boolean}|null>(null)
//   const [filterOpen,   setFilterOpen]   = useState(false)

//   // filters
//   const [dateFilter,   setDateFilter]   = useState('all')   // all | today | tomorrow | week
//   const [levelFilter,  setLevelFilter]  = useState('all')   // all | مبتدئ | متوسط | محترف
//   const [areaFilter,   setAreaFilter]   = useState('all')   // all | dynamic from data

//   useEffect(() => {
//     const s = localStorage.getItem('user')
//     if (s) { try { setUser(JSON.parse(s)) } catch {} }
//     loadMatches()
//   }, [])

//   async function loadMatches() {
//     try {
//       setLoading(true)
//       const data = await api.getMatches()
//       const all: any[] = data.matches || []
//       setMatches(all)
//     } catch(e) { console.error(e) }
//     finally { setLoading(false) }
//   }

//   // ── derive myMatches from matches + user ──────────────────
//   useEffect(() => {
//     if (!user || matches.length === 0) return
//     const uid = user._id || user.id
//     const mine = matches.filter(m =>
//       m.creatorId === uid ||
//       m.players?.some((p:any) => p.userId === uid) ||
//       m.pendingRequests?.some((r:any) => r.userId === uid && r.status === 'pending')
//     )
//     // sort: today first, then by date
//     mine.sort((a,b) => a.date.localeCompare(b.date))
//     setMyMatches(mine)
//   }, [matches, user])

//   async function handleJoinMatch(matchId: string) {
//     if (!user) { router.push('/login?redirect=/matches'); return }
//     setJoiningId(matchId)
//     try {
//       const res = await api.joinMatch(matchId, user._id || user.id)
//       setFeedback({ id: matchId, msg: res.message || 'تم إرسال طلب الانضمام', ok: true })
//       await loadMatches()
//     } catch(err:any) {
//       setFeedback({ id: matchId, msg: err.message || 'حدث خطأ', ok: false })
//     } finally {
//       setJoiningId(null)
//       setTimeout(() => setFeedback(null), 3000)
//     }
//   }

//   // ── filter logic ──────────────────────────────────────────
//   const areas = [...new Set(
//     matches.map(m => m.fieldLocation?.split('،')[0]?.trim()).filter(Boolean)
//   )]

//   const today   = toLocalDateStr(new Date())
//   const tomorrow = (() => { const t=new Date(); t.setDate(t.getDate()+1); return toLocalDateStr(t) })()
//   const weekEnd  = (() => { const t=new Date(); t.setDate(t.getDate()+7); return toLocalDateStr(t) })()

//   const openMatches = matches.filter(m => {
//     if (m.status === 'cancelled') return false
//     const uid = user?._id || user?.id
//     // exclude matches user is already in (those go to slider)
//     // but keep matches user can join
//     if (dateFilter === 'today'    && m.date !== today)     return false
//     if (dateFilter === 'tomorrow' && m.date !== tomorrow)  return false
//     if (dateFilter === 'week'     && m.date > weekEnd)     return false
//     if (levelFilter !== 'all'     && m.level !== levelFilter) return false
//     if (areaFilter  !== 'all'     && !m.fieldLocation?.includes(areaFilter)) return false
//     return true
//   })

//   // ── sort: matches needing players first ───────────────────
//   const uid = user?._id || user?.id
//   const sortedOpen = [...openMatches].sort((a, b) => {
//     // مباريات ناقصة حد تيجي الأول
//     const aNeed = a.totalNeeded - (a.players?.length||0)
//     const bNeed = b.totalNeeded - (b.players?.length||0)
//     if (aNeed > 0 && bNeed <= 0) return -1
//     if (bNeed > 0 && aNeed <= 0) return 1
//     // ثم الأقرب تاريخاً
//     return a.date.localeCompare(b.date)
//   })

//   const grouped = groupByDate(sortedOpen)
//   const activeFiltersCount = [dateFilter!=='all', levelFilter!=='all', areaFilter!=='all'].filter(Boolean).length

//   // ──────────────────────────────────────────────────────────
//   return (
//     <div dir="rtl" style={{ background:C.bg, minHeight:'100vh', color:C.text, fontFamily:"'Cairo','Tajawal',sans-serif" }}>

//       {/* ══ HEADER ══ */}
//       <div style={{
//         background:C.white, borderBottom:`1px solid ${C.grayBorder}`,
//         padding:'14px 20px', position:'sticky', top:0, zIndex:50,
//         display:'flex', alignItems:'center', justifyContent:'space-between',
//       }}>
//         <div style={{ width:38, height:38, borderRadius:'50%', background:C.grayLight, border:`1px solid ${C.grayBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>⚽</div>
//         <div style={{ textAlign:'center' }}>
//           <h1 style={{ margin:0, fontSize:17, fontWeight:800 }}>المباريات المفتوحة</h1>
//           <p style={{ margin:0, fontSize:11, color:C.textMuted, marginTop:2 }}>ابحث عن مباريات أو أنشئ مباراة ودية</p>
//         </div>
//         <Link href="/fields" style={{ textDecoration:'none' }}>
//           <button style={{ background:C.green, color:C.white, border:'none', borderRadius:20, padding:'7px 14px', display:'inline-flex', alignItems:'center', gap:5, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
//             <Plus size={14} /> إنشاء
//           </button>
//         </Link>
//       </div>

//       {/* ══ MY MATCHES SLIDER ══ */}
//       {myMatches.length > 0 && (
//         <div style={{ background:C.white, borderBottom:`1px solid ${C.grayBorder}`, paddingBottom:16 }}>
//           <div style={{ padding:'14px 20px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//             <Link href="/bookings" style={{ textDecoration:'none', fontSize:12, color:C.blue, fontWeight:600 }}>عرض الكل</Link>
//             <h2 style={{ margin:0, fontSize:15, fontWeight:800 }}>مبارياتي القادمة</h2>
//           </div>

//           {/* Slider */}
//           <div
//             ref={sliderRef}
//             style={{
//               display:'flex', gap:12, overflowX:'auto', paddingRight:20, paddingLeft:20,
//               scrollbarWidth:'none', scrollSnapType:'x mandatory',
//             }}
//           >
//             {myMatches.map(match => {
//               const isCreator  = match.creatorId === uid
//               const isJoined   = match.players?.some((p:any) => p.userId === uid)
//               const isPending  = match.pendingRequests?.some((r:any) => r.userId === uid && r.status==='pending')
//               const isFull     = (match.players?.length||0) >= match.totalNeeded
//               const progress   = Math.min(100, ((match.players?.length||0)/match.totalNeeded)*100)
//               const dateLabel  = daysUntil(match.date)
//               const isUrgent   = match.date === today || match.date === tomorrow

//               return (
//                 <Link key={match._id} href={`/matches/${match._id}`} style={{ textDecoration:'none', flexShrink:0, scrollSnapAlign:'start' }}>
//                   <div style={{
//                     width:220, background: isUrgent ? 'linear-gradient(135deg,#1d4ed8,#2563eb)' : C.grayLight,
//                     borderRadius:16, padding:'14px',
//                     border:`1px solid ${isUrgent ? '#1d4ed8' : C.grayBorder}`,
//                     cursor:'pointer',
//                   }}>
//                     {/* badge الوقت */}
//                     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
//                       <span style={{
//                         fontSize:11, fontWeight:700,
//                         background: isUrgent ? 'rgba(255,255,255,0.2)' : C.white,
//                         color: isUrgent ? '#fff' : C.blue,
//                         borderRadius:10, padding:'2px 8px',
//                         border: isUrgent ? 'none' : `1px solid ${C.blueBorder}`,
//                       }}>
//                         {dateLabel}
//                       </span>
//                       <span style={{ fontSize:11, color: isUrgent ? 'rgba(255,255,255,0.7)' : C.textLight }}>
//                         {match.startTime}
//                       </span>
//                     </div>

//                     {/* اسم المباراة */}
//                     <p style={{ margin:'0 0 4px', fontSize:15, fontWeight:800, color: isUrgent ? '#fff' : C.text, lineHeight:1.3 }}>
//                       {match.teamName || match.fieldName}
//                     </p>
//                     <p style={{ margin:'0 0 10px', fontSize:11, color: isUrgent ? 'rgba(255,255,255,0.7)' : C.textMuted, display:'flex', alignItems:'center', gap:3 }}>
//                       <MapPin size={10} /> {match.fieldLocation?.split('،')[0]}
//                     </p>

//                     {/* progress */}
//                     <div style={{ height:3, background: isUrgent ? 'rgba(255,255,255,0.2)' : C.grayBorder, borderRadius:99, overflow:'hidden', marginBottom:8 }}>
//                       <div style={{ height:'100%', width:`${progress}%`, background: isUrgent ? '#fff' : C.green, borderRadius:99, transition:'width .4s' }} />
//                     </div>

//                     <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
//                       <span style={{ fontSize:11, color: isUrgent ? 'rgba(255,255,255,0.8)' : C.textMuted }}>
//                         {match.players?.length||0}/{match.totalNeeded} لاعب
//                       </span>
//                       <span style={{
//                         fontSize:11, fontWeight:600,
//                         color: isCreator ? C.orange : isJoined ? (isUrgent?'#fff':C.green) : C.textMuted,
//                         background: isCreator ? C.orangeBg : 'transparent',
//                         borderRadius:8, padding: isCreator ? '1px 6px' : 0,
//                       }}>
//                         {isCreator ? 'منظم' : isJoined ? '✓ منضم' : isPending ? 'معلق' : ''}
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               )
//             })}
//           </div>
//         </div>
//       )}

//       {/* ══ FILTERS ══ */}
//       <div style={{ padding:'10px 16px 0' }}>
//         <button
//           onClick={() => setFilterOpen(!filterOpen)}
//           style={{
//             width:'100%', background:C.white, border:`1px solid ${C.grayBorder}`,
//             borderRadius:12, padding:'10px 14px', color:C.text,
//             display:'flex', alignItems:'center', justifyContent:'space-between',
//             cursor:'pointer', fontFamily:'inherit', fontSize:14,
//           }}
//         >
//           <div style={{ display:'flex', alignItems:'center', gap:6 }}>
//             {activeFiltersCount > 0 && (
//               <span style={{
//                 background:C.blue, color:'#fff', borderRadius:'50%',
//                 width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center',
//                 fontSize:11, fontWeight:700,
//               }}>
//                 {activeFiltersCount}
//               </span>
//             )}
//             <ChevronLeft size={16} color={C.gray} style={{ transform: filterOpen ? 'rotate(-90deg)' : 'rotate(0)', transition:'.2s' }} />
//           </div>
//           <div style={{ display:'flex', alignItems:'center', gap:7 }}>
//             <span style={{ color:C.textMuted }}>الفلاتر</span>
//             <Filter size={15} color={activeFiltersCount > 0 ? C.blue : C.gray} />
//           </div>
//         </button>

//         {filterOpen && (
//           <div style={{ background:C.white, border:`1px solid ${C.grayBorder}`, borderTop:'none', borderRadius:'0 0 14px 14px', padding:'12px 14px' }}>

//             {/* التاريخ */}
//             <p style={{ margin:'0 0 8px', fontSize:12, color:C.textLight, fontWeight:600, textAlign:'right' }}>التاريخ</p>
//             <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end', marginBottom:12 }}>
//               {[{v:'all',l:'الكل'},{v:'today',l:'اليوم'},{v:'tomorrow',l:'غداً'},{v:'week',l:'هذا الأسبوع'}].map(({v,l}) => (
//                 <Chip key={v} label={l} active={dateFilter===v} onClick={()=>setDateFilter(v)} />
//               ))}
//             </div>

//             {/* المستوى */}
//             <p style={{ margin:'0 0 8px', fontSize:12, color:C.textLight, fontWeight:600, textAlign:'right' }}>المستوى</p>
//             <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end', marginBottom:12 }}>
//               {[{v:'all',l:'الكل'},{v:'مبتدئ',l:'مبتدئ'},{v:'متوسط',l:'متوسط'},{v:'محترف',l:'محترف'}].map(({v,l}) => (
//                 <Chip key={v} label={l} active={levelFilter===v} onClick={()=>setLevelFilter(v)} />
//               ))}
//             </div>

//             {/* المنطقة */}
//             {areas.length > 0 && (
//               <>
//                 <p style={{ margin:'0 0 8px', fontSize:12, color:C.textLight, fontWeight:600, textAlign:'right' }}>المنطقة</p>
//                 <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end' }}>
//                   <Chip label="الكل" active={areaFilter==='all'} onClick={()=>setAreaFilter('all')} />
//                   {areas.map(a => (
//                     <Chip key={a} label={a!} active={areaFilter===a} onClick={()=>setAreaFilter(a!)} />
//                   ))}
//                 </div>
//               </>
//             )}

//             {/* reset */}
//             {activeFiltersCount > 0 && (
//               <button
//                 onClick={() => { setDateFilter('all'); setLevelFilter('all'); setAreaFilter('all') }}
//                 style={{
//                   marginTop:12, width:'100%', background:'transparent', border:`1px solid ${C.red}`,
//                   borderRadius:10, padding:'7px', color:C.red, fontSize:13, fontWeight:600,
//                   cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:5,
//                 }}
//               >
//                 <X size={13} /> إزالة الفلاتر
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ══ OPEN MATCHES LIST ══ */}
//       <div style={{ padding:'10px 16px 24px' }}>

//         {loading && (
//           <div style={{ textAlign:'center', padding:'60px 0' }}>
//             <Loader2 size={32} color={C.blue} style={{ animation:'spin 1s linear infinite', display:'block', margin:'0 auto' }} />
//             <p style={{ color:C.textMuted, marginTop:12, fontSize:14 }}>جاري التحميل...</p>
//           </div>
//         )}

//         {!loading && grouped.length === 0 && (
//           <div style={{ textAlign:'center', padding:'60px 0' }}>
//             <Trophy size={48} color={C.grayBorder} style={{ margin:'0 auto 16px', display:'block' }} />
//             <p style={{ color:C.textMuted, fontSize:15 }}>لا توجد مباريات{activeFiltersCount>0?' بهذه الفلاتر':' حالياً'}</p>
//             {activeFiltersCount > 0 ? (
//               <button onClick={()=>{setDateFilter('all');setLevelFilter('all');setAreaFilter('all')}} style={{ marginTop:12, background:C.blue, color:'#fff', border:'none', borderRadius:12, padding:'9px 22px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
//                 إزالة الفلاتر
//               </button>
//             ) : (
//               <Link href="/fields" style={{ textDecoration:'none' }}>
//                 <button style={{ marginTop:12, background:C.green, color:'#fff', border:'none', borderRadius:12, padding:'9px 22px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
//                   أنشئ مباراة الآن
//                 </button>
//               </Link>
//             )}
//           </div>
//         )}

//         {!loading && grouped.map(([dateStr, dayMatches]) => (
//           <div key={dateStr} style={{ marginBottom:6 }}>

//             {/* Date header */}
//             <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 2px 8px' }}>
//               <div style={{ display:'flex', alignItems:'center', gap:5 }}>
//                 <span style={{ fontSize:12, color:C.textMuted, background:C.white, border:`1px solid ${C.grayBorder}`, borderRadius:8, padding:'2px 9px' }}>
//                   {dayMatches.length} مباريات
//                 </span>
//               </div>
//               <div style={{ display:'flex', alignItems:'center', gap:6 }}>
//                 {getDateLabel(dateStr) && (
//                   <span style={{ fontSize:13, color:C.blue, fontWeight:700, background:C.blueBg, border:`1px solid ${C.blueBorder}`, borderRadius:10, padding:'1px 9px' }}>
//                     {getDateLabel(dateStr)}
//                   </span>
//                 )}
//                 <span style={{ fontSize:15, fontWeight:700 }}>{formatMatchDate(dateStr)}</span>
//               </div>
//             </div>

//             {/* Match cards */}
//             {dayMatches.map(match => {
//               const isCreator    = match.creatorId === uid
//               const isJoined     = match.players?.some((p:any) => p.userId === uid)
//               const hasRequested = match.pendingRequests?.some((r:any) => r.userId === uid && r.status==='pending')
//               const isFull       = (match.players?.length||0) >= match.totalNeeded
//               const pendingCount = match.pendingRequests?.filter((r:any)=>r.status==='pending').length || 0
//               const progress     = Math.min(100, ((match.players?.length||0)/match.totalNeeded)*100)
//               const thisFeedback = feedback?.id === match._id ? feedback : null
//               const spotsLeft    = match.totalNeeded - (match.players?.length||0)

//               return (
//                 <div key={match._id} style={{
//                   background:C.white, border:`1px solid ${C.grayBorder}`,
//                   borderRadius:16, marginBottom:10, overflow:'hidden',
//                   boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
//                 }}>
//                   {/* ── صف المنشئ ── */}
//                   <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 14px 8px' }}>
//                     <div style={{ display:'flex', alignItems:'center', gap:10 }}>
//                       <div style={{ width:42, height:42, borderRadius:'50%', background:C.blueBg, border:`1px solid ${C.blueBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:C.blue, flexShrink:0 }}>
//                         {initials(match.creatorName)}
//                       </div>
//                       <div style={{ textAlign:'right' }}>
//                         <p style={{ margin:0, fontSize:15, fontWeight:700 }}>{match.creatorName}</p>
//                         <p style={{ margin:0, fontSize:11, color:C.textLight }}>{match.previousMatches||0} مباريات سابقة</p>
//                       </div>
//                     </div>
//                     <Link href={`/matches/${match._id}`} style={{ textDecoration:'none' }}>
//                       <div style={{ width:28, height:28, borderRadius:'50%', background:C.grayLight, border:`1px solid ${C.grayBorder}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
//                         <ChevronLeft size={14} color={C.gray} />
//                       </div>
//                     </Link>
//                   </div>

//                   {/* ── اسم الفريق + موقع ── */}
//                   <div style={{ padding:'0 14px 8px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//                     <h3 style={{ margin:0, fontSize:17, fontWeight:800 }}>{match.teamName||match.fieldName}</h3>
//                     {match.fieldLocation && (
//                       <span style={{ background:C.grayLight, border:`1px solid ${C.grayBorder}`, borderRadius:8, padding:'3px 9px', fontSize:12, color:C.textMuted, display:'inline-flex', alignItems:'center', gap:4 }}>
//                         <MapPin size={11} color={C.textMuted} />
//                         {match.fieldLocation.split('،')[0]||match.fieldLocation}
//                       </span>
//                     )}
//                   </div>

//                   {/* ── التاريخ والوقت ── */}
//                   <div style={{ padding:'0 14px 10px' }}>
//                     <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:C.grayLight, border:`1px solid ${C.grayBorder}`, borderRadius:10, padding:'5px 11px' }}>
//                       <Calendar size={12} color={C.textMuted} />
//                       <span style={{ fontSize:12, color:C.textMuted }}>
//                         {new Date(match.date).toLocaleDateString('ar-EG',{weekday:'short',day:'numeric',month:'short'})}
//                       </span>
//                       <span style={{ fontSize:12, color:C.grayBorder }}>|</span>
//                       <Clock size={12} color={C.textMuted} />
//                       <span style={{ fontSize:12, color:C.textMuted, direction:'ltr' }}>{match.startTime} – {match.endTime}</span>
//                     </div>
//                   </div>

//                   {/* ── progress bar ── */}
//                   <div style={{ padding:'0 14px 6px' }}>
//                     <div style={{ height:4, background:C.grayLight, borderRadius:99, overflow:'hidden' }}>
//                       <div style={{
//                         height:'100%', width:`${progress}%`,
//                         background: isFull ? C.gray : `linear-gradient(90deg,${C.blue},#60a5fa)`,
//                         borderRadius:99, transition:'width .4s ease',
//                       }} />
//                     </div>
//                   </div>

//                   {/* ── صف أسفل ── */}
//                   <div style={{ padding:'6px 14px 13px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
//                     {/* يمين: معلق + متبقي */}
//                     <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//                       {pendingCount > 0 && (
//                         <span style={{ fontSize:12, color:'#d97706', fontWeight:600, background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12, padding:'1px 8px' }}>
//                           {pendingCount} في الانتظار
//                         </span>
//                       )}
//                       <span style={{ fontSize:12, color: isFull?C.red:C.textMuted, fontWeight: isFull?600:400 }}>
//                         {match.players?.length||0}/{match.totalNeeded} متبقي
//                       </span>
//                     </div>

//                     {/* يسار: الزر */}
//                     <div>
//                       {thisFeedback ? (
//                         <span style={{ fontSize:12, fontWeight:600, color:thisFeedback.ok?C.green:C.red, display:'inline-flex', alignItems:'center', gap:4 }}>
//                           {thisFeedback.ok ? <Check size={13}/> : <AlertCircle size={13}/>}
//                           {thisFeedback.msg}
//                         </span>
//                       ) : isCreator ? (
//                         <Link href={`/matches/${match._id}/requests`} style={{ textDecoration:'none' }}>
//                           <button style={btnStyle(C.blueBg,C.blueBorder,C.blue,true)}>
//                             <Users size={13}/> إدارة ({pendingCount})
//                           </button>
//                         </Link>
//                       ) : isJoined ? (
//                         <button style={btnStyle(C.greenBg,C.greenBorder,C.green)} disabled>
//                           <Check size={13}/> منضم ✓
//                         </button>
//                       ) : hasRequested ? (
//                         <button style={btnStyle(C.orangeBg,C.orangeBorder,C.orange)} disabled>
//                           <Timer size={13}/> طلب معلق
//                         </button>
//                       ) : isFull ? (
//                         <button style={btnStyle(C.grayLight,C.grayBorder,C.gray)} disabled>اكتمل العدد</button>
//                       ) : (
//                         <button
//                           onClick={() => handleJoinMatch(match._id)}
//                           disabled={joiningId===match._id}
//                           style={btnStyle(C.green,C.green,C.white,true)}
//                         >
//                           {joiningId===match._id ? <Loader2 size={13} style={{animation:'spin 1s linear infinite'}}/> : <UserPlus size={13}/>}
//                           طلب انضمام
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         ))}
//       </div>

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg) } }
//         * { box-sizing: border-box }
//         ::-webkit-scrollbar { display: none }
//       `}</style>
//     </div>
//   )
// }




'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import Link from 'next/link'
import {
  Calendar, Users, UserPlus, Check, Loader2, Trophy,
  SlidersHorizontal, Plus, ChevronRight, ChevronLeft,
  Timer, AlertCircle, MapPin, Clock, X, Filter
} from 'lucide-react'

// ── helpers ───────────────────────────────────────────────────
function toLocalDateStr(d: Date) {
  return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-')
}
function formatMatchDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })
}
function getDateLabel(dateStr: string) {
  const today = toLocalDateStr(new Date())
  const tom = new Date(); tom.setDate(tom.getDate()+1)
  if (dateStr === today) return 'اليوم'
  if (dateStr === toLocalDateStr(tom)) return 'غداً'
  return ''
}
function groupByDate(matches: any[]) {
  const map: Record<string, any[]> = {}
  matches.forEach(m => { if(!map[m.date]) map[m.date]=[]; map[m.date].push(m) })
  return Object.entries(map).sort(([a],[b]) => a.localeCompare(b))
}
function initials(name: string) {
  return name?.split(' ').slice(0,2).map((w:string)=>w[0]).join('') || '?'
}
function daysUntil(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - new Date().setHours(0,0,0,0)) / 86400000)
  if (diff === 0) return 'اليوم'
  if (diff === 1) return 'غداً'
  if (diff < 0)  return 'انتهت'
  return `بعد ${diff} أيام`
}

// ── color palette ──────────────────────────────────────────────
const C = {
  blue:'#2563eb', blueBg:'#eff6ff', blueBorder:'#bfdbfe',
  green:'#16a34a', greenBg:'#f0fdf4', greenBorder:'#bbf7d0', white:'#ffffff',
  gray:'#6b7280', grayBg:'#f9fafb', grayBorder:'#e5e7eb', grayLight:'#f3f4f6',
  text:'#111827', textMuted:'#6b7280', textLight:'#9ca3af',
  orange:'#c2410c', orangeBg:'#fff7ed', orangeBorder:'#fed7aa',
  red:'#dc2626', bg:'#f9fafb',
}

function btnStyle(bg:string, border:string, color:string, clickable=false) {
  return {
    background:bg, border:`1px solid ${border}`, borderRadius:20,
    padding:'6px 14px', fontSize:13, fontWeight:600, color,
    display:'inline-flex' as const, alignItems:'center' as const, gap:5,
    cursor: clickable ? 'pointer' : 'default',
    fontFamily:'inherit', opacity: clickable ? 1 : 0.75,
    transition:'all .15s', whiteSpace:'nowrap' as const, flexDirection:'row' as const,
  }
}

// ── filter chip ───────────────────────────────────────────────
function Chip({ label, active, onClick }: { label:string; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{
      padding:'5px 14px', borderRadius:20, fontSize:13,
      fontFamily:'inherit', cursor:'pointer', flexShrink:0,
      border:`1px solid ${active ? C.blue : C.grayBorder}`,
      background: active ? C.blueBg : C.white,
      color: active ? C.blue : C.textMuted,
      fontWeight: active ? 700 : 400, transition:'.15s',
    }}>
      {label}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
export default function MatchesPage() {
  const router = useRouter()
  const sliderRef = useRef<HTMLDivElement>(null)

  const [matches,           setMatches]           = useState<any[]>([])
  const [neededMatches,     setNeededMatches]     = useState<any[]>([]) // المباريات الناقصة (من الحجوزات)
  const [regularMatches,    setRegularMatches]    = useState<any[]>([]) // المباريات العادية (المنشأة)
  const [myMatches,         setMyMatches]         = useState<any[]>([]) // مبارياتي
  const [loading,           setLoading]           = useState(true)
  const [user,              setUser]              = useState<any>(null)
  const [joiningId,         setJoiningId]         = useState<string|null>(null)
  const [feedback,          setFeedback]          = useState<{id:string;msg:string;ok:boolean}|null>(null)
  const [filterOpen,        setFilterOpen]        = useState(false)

  // filters
  const [dateFilter,   setDateFilter]   = useState('all')
  const [levelFilter,  setLevelFilter]  = useState('all')
  const [areaFilter,   setAreaFilter]   = useState('all')

  useEffect(() => {
    const s = localStorage.getItem('user')
    if (s) { try { setUser(JSON.parse(s)) } catch {} }
    loadMatches()
  }, [])

  async function loadMatches() {
    try {
      setLoading(true)
      const data = await api.getMatches()
      const all: any[] = data.matches || []
      
      // ✅ تصفية المباريات الملغية
      const activeMatches = all.filter(m => m.status !== 'cancelled')
      setMatches(activeMatches)
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  // ── فصل المباريات حسب النوع ──────────────────────────────────
  useEffect(() => {
    if (matches.length === 0) return
    
    // المباريات الناقصة (من الحجوزات) - اللي فيها منشئ + ناقصين
    const needed = matches.filter(m => 
      m.fromBooking === true && // لازم يكون عندك field في الـ match بيحدد إنه من حجز
      m.status === 'open' &&
      m.players?.length < m.totalNeeded
    )
    
    // المباريات العادية (المنشأة مباشرة)
    const regular = matches.filter(m => 
      !m.fromBooking && // مش من حجز
      m.status === 'open'
    )
    
    setNeededMatches(needed)
    setRegularMatches(regular)

    // مباريات المستخدم (للسليدر)
    if (user) {
      const uid = user._id || user.id
      const mine = matches.filter(m =>
        m.creatorId === uid ||
        m.players?.some((p:any) => p.userId === uid) ||
        m.pendingRequests?.some((r:any) => r.userId === uid && r.status === 'pending')
      )
      mine.sort((a,b) => a.date.localeCompare(b.date))
      setMyMatches(mine)
    }
  }, [matches, user])

  async function handleJoinMatch(matchId: string) {
    if (!user) { router.push('/login?redirect=/matches'); return }
    setJoiningId(matchId)
    try {
      const res = await api.joinMatch(matchId, user._id || user.id)
      setFeedback({ id: matchId, msg: res.message || 'تم إرسال طلب الانضمام', ok: true })
      await loadMatches()
    } catch(err:any) {
      setFeedback({ id: matchId, msg: err.message || 'حدث خطأ', ok: false })
    } finally {
      setJoiningId(null)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  // ── filter logic ──────────────────────────────────────────
  const areas = [...new Set(
    matches.map(m => m.fieldLocation?.split('،')[0]?.trim()).filter(Boolean)
  )]

  const today   = toLocalDateStr(new Date())
  const tomorrow = (() => { const t=new Date(); t.setDate(t.getDate()+1); return toLocalDateStr(t) })()
  const weekEnd  = (() => { const t=new Date(); t.setDate(t.getDate()+7); return toLocalDateStr(t) })()

  // فلترة المباريات العادية (الرأسية)
  const filteredRegular = regularMatches.filter(m => {
    if (dateFilter === 'today'    && m.date !== today)     return false
    if (dateFilter === 'tomorrow' && m.date !== tomorrow)  return false
    if (dateFilter === 'week'     && m.date > weekEnd)     return false
    if (levelFilter !== 'all'     && m.level !== levelFilter) return false
    if (areaFilter  !== 'all'     && !m.fieldLocation?.includes(areaFilter)) return false
    return true
  })

  // ترتيب المباريات العادية (الأقرب تاريخاً)
  const sortedRegular = [...filteredRegular].sort((a, b) => 
    a.date.localeCompare(b.date)
  )

  const grouped = groupByDate(sortedRegular)
  const activeFiltersCount = [dateFilter!=='all', levelFilter!=='all', areaFilter!=='all'].filter(Boolean).length
  const uid = user?._id || user?.id

  // دوال تحريك السليدر
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -240, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 240, behavior: 'smooth' })
    }
  }

  // ──────────────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{ background:C.bg, minHeight:'100vh', color:C.text, fontFamily:"'Cairo','Tajawal',sans-serif" }}>

      {/* ══ HEADER ══ */}
      <div style={{
        background:C.white, borderBottom:`1px solid ${C.grayBorder}`,
        padding:'14px 20px', position:'sticky', top:0, zIndex:50,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ width:38, height:38, borderRadius:'50%', background:C.grayLight, border:`1px solid ${C.grayBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>⚽</div>
        <div style={{ textAlign:'center' }}>
          <h1 style={{ margin:0, fontSize:17, fontWeight:800 }}>المباريات</h1>
          <p style={{ margin:0, fontSize:11, color:C.textMuted, marginTop:2 }}>مباريات ناقصة ومفتوحة</p>
        </div>
        <Link href="/fields" style={{ textDecoration:'none' }}>
          <button style={{ background:C.green, color:C.white, border:'none', borderRadius:20, padding:'7px 14px', display:'inline-flex', alignItems:'center', gap:5, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            <Plus size={14} /> إنشاء
          </button>
        </Link>
      </div>

      {/* ══ المباريات الناقصة (Slider أفقي) ══ */}
      {neededMatches.length > 0 && (
        <div style={{ background:C.white, borderBottom:`1px solid ${C.grayBorder}`, paddingBottom:16, position:'relative' }}>
          <div style={{ padding:'14px 20px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={scrollLeft} style={{ background:'none', border:`1px solid ${C.grayBorder}`, borderRadius:'50%', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <ChevronRight size={16} color={C.gray} />
              </button>
              <button onClick={scrollRight} style={{ background:'none', border:`1px solid ${C.grayBorder}`, borderRadius:'50%', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <ChevronLeft size={16} color={C.gray} />
              </button>
            </div>
            <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:C.orange }}>
              مباريات ناقصة لاعبين ⚡
            </h2>
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            style={{
              display:'flex', gap:12, overflowX:'auto', paddingRight:20, paddingLeft:20,
              scrollbarWidth:'none', scrollSnapType:'x mandatory',
            }}
          >
            {neededMatches.map(match => {
              const progress = Math.min(100, ((match.players?.length||0)/match.totalNeeded)*100)
              const spotsLeft = match.totalNeeded - (match.players?.length||0)

              return (
                <Link key={match._id} href={`/matches/${match._id}`} style={{ textDecoration:'none', flexShrink:0, scrollSnapAlign:'start' }}>
                  <div style={{
                    width:240, background: 'linear-gradient(135deg,#f97316,#fb923c)',
                    borderRadius:16, padding:'14px',
                    border:'none', cursor:'pointer',
                  }}>
                    {/* badge الوقت */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                      <span style={{
                        fontSize:11, fontWeight:700,
                        background:'rgba(255,255,255,0.2)',
                        color:'#fff', borderRadius:10, padding:'2px 8px',
                      }}>
                        {daysUntil(match.date)}
                      </span>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>
                        {match.startTime}
                      </span>
                    </div>

                    {/* اسم الملعب */}
                    <p style={{ margin:'0 0 4px', fontSize:15, fontWeight:800, color:'#fff', lineHeight:1.3 }}>
                      {match.fieldName}
                    </p>
                    <p style={{ margin:'0 0 10px', fontSize:11, color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', gap:3 }}>
                      <MapPin size={10} /> {match.fieldLocation?.split('،')[0]}
                    </p>

                    {/* progress */}
                    <div style={{ height:3, background:'rgba(255,255,255,0.2)', borderRadius:99, overflow:'hidden', marginBottom:8 }}>
                      <div style={{ height:'100%', width:`${progress}%`, background:'#fff', borderRadius:99 }} />
                    </div>

                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,0.8)' }}>
                        {match.players?.length||0}/{match.totalNeeded} لاعب
                      </span>
                      <span style={{ fontSize:11, fontWeight:600, color:'#fff', background:'rgba(255,255,255,0.2)', borderRadius:8, padding:'2px 8px' }}>
                        {spotsLeft} متبقي
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ══ FILTERS ══ */}
      <div style={{ padding:'10px 16px 0' }}>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          style={{
            width:'100%', background:C.white, border:`1px solid ${C.grayBorder}`,
            borderRadius:12, padding:'10px 14px', color:C.text,
            display:'flex', alignItems:'center', justifyContent:'space-between',
            cursor:'pointer', fontFamily:'inherit', fontSize:14,
          }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {activeFiltersCount > 0 && (
              <span style={{
                background:C.blue, color:'#fff', borderRadius:'50%',
                width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:700,
              }}>
                {activeFiltersCount}
              </span>
            )}
            <ChevronLeft size={16} color={C.gray} style={{ transform: filterOpen ? 'rotate(-90deg)' : 'rotate(0)', transition:'.2s' }} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ color:C.textMuted }}>الفلاتر</span>
            <Filter size={15} color={activeFiltersCount > 0 ? C.blue : C.gray} />
          </div>
        </button>

        {filterOpen && (
          <div style={{ background:C.white, border:`1px solid ${C.grayBorder}`, borderTop:'none', borderRadius:'0 0 14px 14px', padding:'12px 14px' }}>
            {/* التاريخ */}
            <p style={{ margin:'0 0 8px', fontSize:12, color:C.textLight, fontWeight:600, textAlign:'right' }}>التاريخ</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end', marginBottom:12 }}>
              {[{v:'all',l:'الكل'},{v:'today',l:'اليوم'},{v:'tomorrow',l:'غداً'},{v:'week',l:'هذا الأسبوع'}].map(({v,l}) => (
                <Chip key={v} label={l} active={dateFilter===v} onClick={()=>setDateFilter(v)} />
              ))}
            </div>

            {/* المستوى */}
            <p style={{ margin:'0 0 8px', fontSize:12, color:C.textLight, fontWeight:600, textAlign:'right' }}>المستوى</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end', marginBottom:12 }}>
              {[{v:'all',l:'الكل'},{v:'مبتدئ',l:'مبتدئ'},{v:'متوسط',l:'متوسط'},{v:'محترف',l:'محترف'}].map(({v,l}) => (
                <Chip key={v} label={l} active={levelFilter===v} onClick={()=>setLevelFilter(v)} />
              ))}
            </div>

            {/* المنطقة */}
            {areas.length > 0 && (
              <>
                <p style={{ margin:'0 0 8px', fontSize:12, color:C.textLight, fontWeight:600, textAlign:'right' }}>المنطقة</p>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', justifyContent:'flex-end' }}>
                  <Chip label="الكل" active={areaFilter==='all'} onClick={()=>setAreaFilter('all')} />
                  {areas.map(a => (
                    <Chip key={a} label={a!} active={areaFilter===a} onClick={()=>setAreaFilter(a!)} />
                  ))}
                </div>
              </>
            )}

            {/* reset */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => { setDateFilter('all'); setLevelFilter('all'); setAreaFilter('all') }}
                style={{
                  marginTop:12, width:'100%', background:'transparent', border:`1px solid ${C.red}`,
                  borderRadius:10, padding:'7px', color:C.red, fontSize:13, fontWeight:600,
                  cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:5,
                }}
              >
                <X size={13} /> إزالة الفلاتر
              </button>
            )}
          </div>
        )}
      </div>

      {/* ══ المباريات العادية (رأسي) ══ */}
      <div style={{ padding:'10px 16px 24px' }}>

        {loading && (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <Loader2 size={32} color={C.blue} style={{ animation:'spin 1s linear infinite', display:'block', margin:'0 auto' }} />
            <p style={{ color:C.textMuted, marginTop:12, fontSize:14 }}>جاري التحميل...</p>
          </div>
        )}

        {!loading && grouped.length === 0 && regularMatches.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <Trophy size={48} color={C.grayBorder} style={{ margin:'0 auto 16px', display:'block' }} />
            <p style={{ color:C.textMuted, fontSize:15 }}>لا توجد مباريات عادية</p>
          </div>
        )}

        {!loading && grouped.length > 0 && (
          <>
            <h3 style={{ margin:'20px 0 10px', fontSize:16, fontWeight:700, color:C.text }}>مباريات مفتوحة</h3>
            {grouped.map(([dateStr, dayMatches]) => (
              <div key={dateStr} style={{ marginBottom:6 }}>
                {/* Date header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 2px 8px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ fontSize:12, color:C.textMuted, background:C.white, border:`1px solid ${C.grayBorder}`, borderRadius:8, padding:'2px 9px' }}>
                      {dayMatches.length} مباريات
                    </span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {getDateLabel(dateStr) && (
                      <span style={{ fontSize:13, color:C.blue, fontWeight:700, background:C.blueBg, border:`1px solid ${C.blueBorder}`, borderRadius:10, padding:'1px 9px' }}>
                        {getDateLabel(dateStr)}
                      </span>
                    )}
                    <span style={{ fontSize:15, fontWeight:700 }}>{formatMatchDate(dateStr)}</span>
                  </div>
                </div>

                {/* Match cards */}
                {dayMatches.map(match => {
                  const isCreator    = match.creatorId === uid
                  const isJoined     = match.players?.some((p:any) => p.userId === uid)
                  const hasRequested = match.pendingRequests?.some((r:any) => r.userId === uid && r.status==='pending')
                  const isFull       = (match.players?.length||0) >= match.totalNeeded
                  const pendingCount = match.pendingRequests?.filter((r:any)=>r.status==='pending').length || 0
                  const progress     = Math.min(100, ((match.players?.length||0)/match.totalNeeded)*100)
                  const thisFeedback = feedback?.id === match._id ? feedback : null
                  const spotsLeft    = match.totalNeeded - (match.players?.length||0)

                  return (
                    <div key={match._id} style={{
                      background:C.white, border:`1px solid ${C.grayBorder}`,
                      borderRadius:16, marginBottom:10, overflow:'hidden',
                      boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
                    }}>
                      {/* محتوى المباراة */}
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 14px 8px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:42, height:42, borderRadius:'50%', background:C.blueBg, border:`1px solid ${C.blueBorder}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:C.blue, flexShrink:0 }}>
                            {initials(match.creatorName)}
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <p style={{ margin:0, fontSize:15, fontWeight:700 }}>{match.creatorName}</p>
                            <p style={{ margin:0, fontSize:11, color:C.textLight }}>{match.previousMatches||0} مباريات سابقة</p>
                          </div>
                        </div>
                        <Link href={`/matches/${match._id}`} style={{ textDecoration:'none' }}>
                          <div style={{ width:28, height:28, borderRadius:'50%', background:C.grayLight, border:`1px solid ${C.grayBorder}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                            <ChevronLeft size={14} color={C.gray} />
                          </div>
                        </Link>
                      </div>

                      <div style={{ padding:'0 14px 8px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <h3 style={{ margin:0, fontSize:17, fontWeight:800 }}>{match.teamName||match.fieldName}</h3>
                        {match.fieldLocation && (
                          <span style={{ background:C.grayLight, border:`1px solid ${C.grayBorder}`, borderRadius:8, padding:'3px 9px', fontSize:12, color:C.textMuted, display:'inline-flex', alignItems:'center', gap:4 }}>
                            <MapPin size={11} color={C.textMuted} />
                            {match.fieldLocation.split('،')[0]||match.fieldLocation}
                          </span>
                        )}
                      </div>

                      <div style={{ padding:'0 14px 10px' }}>
                        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:C.grayLight, border:`1px solid ${C.grayBorder}`, borderRadius:10, padding:'5px 11px' }}>
                          <Calendar size={12} color={C.textMuted} />
                          <span style={{ fontSize:12, color:C.textMuted }}>
                            {new Date(match.date).toLocaleDateString('ar-EG',{weekday:'short',day:'numeric',month:'short'})}
                          </span>
                          <span style={{ fontSize:12, color:C.grayBorder }}>|</span>
                          <Clock size={12} color={C.textMuted} />
                          <span style={{ fontSize:12, color:C.textMuted, direction:'ltr' }}>{match.startTime} – {match.endTime}</span>
                        </div>
                      </div>

                      <div style={{ padding:'0 14px 6px' }}>
                        <div style={{ height:4, background:C.grayLight, borderRadius:99, overflow:'hidden' }}>
                          <div style={{
                            height:'100%', width:`${progress}%`,
                            background: isFull ? C.gray : `linear-gradient(90deg,${C.blue},#60a5fa)`,
                            borderRadius:99, transition:'width .4s ease',
                          }} />
                        </div>
                      </div>

                      <div style={{ padding:'6px 14px 13px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          {pendingCount > 0 && (
                            <span style={{ fontSize:12, color:'#d97706', fontWeight:600, background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12, padding:'1px 8px' }}>
                              {pendingCount} في الانتظار
                            </span>
                          )}
                          <span style={{ fontSize:12, color: isFull?C.red:C.textMuted, fontWeight: isFull?600:400 }}>
                            {match.players?.length||0}/{match.totalNeeded} متبقي
                          </span>
                        </div>

                        <div>
                          {thisFeedback ? (
                            <span style={{ fontSize:12, fontWeight:600, color:thisFeedback.ok?C.green:C.red, display:'inline-flex', alignItems:'center', gap:4 }}>
                              {thisFeedback.ok ? <Check size={13}/> : <AlertCircle size={13}/>}
                              {thisFeedback.msg}
                            </span>
                          ) : isCreator ? (
                            <Link href={`/matches/${match._id}/requests`} style={{ textDecoration:'none' }}>
                              <button style={btnStyle(C.blueBg,C.blueBorder,C.blue,true)}>
                                <Users size={13}/> إدارة ({pendingCount})
                              </button>
                            </Link>
                          ) : isJoined ? (
                            <button style={btnStyle(C.greenBg,C.greenBorder,C.green)} disabled>
                              <Check size={13}/> منضم ✓
                            </button>
                          ) : hasRequested ? (
                            <button style={btnStyle(C.orangeBg,C.orangeBorder,C.orange)} disabled>
                              <Timer size={13}/> طلب معلق
                            </button>
                          ) : isFull ? (
                            <button style={btnStyle(C.grayLight,C.grayBorder,C.gray)} disabled>اكتمل العدد</button>
                          ) : (
                            <button
                              onClick={() => handleJoinMatch(match._id)}
                              disabled={joiningId===match._id}
                              style={btnStyle(C.green,C.green,C.white,true)}
                            >
                              {joiningId===match._id ? <Loader2 size={13} style={{animation:'spin 1s linear infinite'}}/> : <UserPlus size={13}/>}
                              طلب انضمام
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        * { box-sizing: border-box }
        ::-webkit-scrollbar { display: none }
      `}</style>
    </div>
  )
}