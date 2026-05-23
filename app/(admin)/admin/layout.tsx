"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Home
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const adminLinks = [
  {
    href: "/admin",
    label: "لوحة التحكم",
    icon: LayoutDashboard
  },
  {
    href: "/admin/fields",
    label: "إدارة الملاعب",
    icon: CalendarDays
  },
  {
    href: "/admin/bookings",
    label: "إدارة الحجوزات",
    icon: CalendarDays
  },
  {
    href: "/admin/users",
    label: "إدارة المستخدمين",
    icon: Users
  },
  {
    href: "/admin/settings",
    label: "الإعدادات",
    icon: Settings
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 right-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transition-transform duration-300 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-l from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚽</span>
              </div>
              <span className="text-xl font-bold">كوره بوك</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {adminLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom Links */}
          <div className="absolute bottom-6 right-6 left-6">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition mb-2"
            >
              <Home className="w-5 h-5" />
              <span>العودة للموقع</span>
            </Link>
            <button
              className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-64 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}





// "use client"

// import { useEffect, useState } from "react"
// import { useRouter, usePathname } from "next/navigation"
// import Link from "next/link"
// import {
//   LayoutDashboard,
//   CalendarDays,
//   Users,
//   ClipboardList,
//   BarChart3,
//   LogOut,
//   Menu,
//   X,
//   Home,
//   Shield,
//   Bell,
//   ChevronRight,
//   Trophy
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { Loader2 } from "lucide-react"

// const adminLinks = [
//   { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
//   { href: "/admin/fields", label: "إدارة الملاعب", icon: CalendarDays },
//   { href: "/admin/bookings", label: "إدارة الحجوزات", icon: ClipboardList },
//   { href: "/admin/users", label: "إدارة المستخدمين", icon: Users },
//   { href: "/admin/matches", label: "إدارة المباريات", icon: Trophy },
//   { href: "/admin/reports", label: "التقارير والإحصائيات", icon: BarChart3 },
// ]

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
//   const [user, setUser] = useState<any>(null)

//   useEffect(() => {
//     const userStr = localStorage.getItem('user')
//     if (!userStr) {
//       router.push('/login?redirect=/admin')
//       return
//     }
//     try {
//       const userData = JSON.parse(userStr)
//       if (userData.role === 'admin') {
//         setIsAdmin(true)
//         setUser(userData)
//       } else {
//         router.push('/')
//       }
//     } catch {
//       router.push('/login')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   const handleLogout = () => {
//     localStorage.removeItem('user')
//     localStorage.removeItem('token')
//     document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
//     window.dispatchEvent(new Event('userChanged'))
//     router.push('/')
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
//           <p className="text-gray-500">جاري التحقق من الصلاحيات...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!isAdmin) return null

//   return (
//     <div className="min-h-screen bg-gray-100 flex" dir="rtl">
//       {/* Overlay للموبايل */}
//       {isSidebarOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={cn(
//         "fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transition-transform duration-300 flex flex-col",
//         "lg:translate-x-0",
//         isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
//       )}>
//         {/* Logo */}
//         <div className="p-6 border-b border-gray-100">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="w-9 h-9 bg-gradient-to-l from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
//                 <span className="text-white font-bold">⚽</span>
//               </div>
//               <div>
//                 <p className="font-bold text-gray-900">كوره بوك</p>
//                 <p className="text-xs text-blue-600 flex items-center gap-1">
//                   <Shield className="w-3 h-3" /> لوحة التحكم
//                 </p>
//               </div>
//             </div>
//             <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:bg-gray-100 rounded">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* User Info */}
//         <div className="px-6 py-4 bg-blue-50 mx-4 mt-4 rounded-xl">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-gradient-to-l from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
//               {user?.name?.slice(0, 2) || "أد"}
//             </div>
//             <div>
//               <p className="font-medium text-sm text-gray-900">{user?.name}</p>
//               <p className="text-xs text-gray-500">{user?.email}</p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
//           {adminLinks.map((link) => {
//             const Icon = link.icon
//             const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)
//             return (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 onClick={() => setIsSidebarOpen(false)}
//                 className={cn(
//                   "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
//                   isActive
//                     ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//                     : "text-gray-600 hover:bg-gray-100"
//                 )}
//               >
//                 <Icon className="w-5 h-5 flex-shrink-0" />
//                 <span>{link.label}</span>
//                 {isActive && <ChevronRight className="w-4 h-4 mr-auto" />}
//               </Link>
//             )
//           })}
//         </nav>

//         {/* Bottom */}
//         <div className="p-4 border-t border-gray-100 space-y-1">
//           <Link
//             href="/"
//             className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition text-sm"
//           >
//             <Home className="w-5 h-5" />
//             العودة للموقع
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition w-full text-sm font-medium"
//           >
//             <LogOut className="w-5 h-5" />
//             تسجيل الخروج
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 lg:mr-64 flex flex-col min-h-screen">
//         {/* Top Bar */}
//         <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
//           <button
//             onClick={() => setIsSidebarOpen(true)}
//             className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
//           >
//             <Menu className="w-5 h-5" />
//           </button>

//           {/* Breadcrumb */}
//           <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
//             <Shield className="w-4 h-4 text-blue-600" />
//             <span className="text-blue-600 font-medium">الأدمن</span>
//             <ChevronRight className="w-3 h-3" />
//             <span className="text-gray-700">
//               {adminLinks.find(l => l.exact ? pathname === l.href : pathname.startsWith(l.href))?.label || "لوحة التحكم"}
//             </span>
//           </div>

//           <div className="flex items-center gap-3 mr-auto">
//             <button className="relative p-2 hover:bg-gray-100 rounded-lg">
//               <Bell className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-6">
//           <div className="max-w-7xl mx-auto">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }