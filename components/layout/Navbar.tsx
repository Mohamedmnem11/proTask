"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  CalendarDays,
  Menu,
  User,
  LogOut,
  Home,
  Clock,
  Trophy,
  X,
  ChevronDown,
  Bell,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect, useCallback } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// ✅ Type واضح للمستخدم
interface UserData {
  _id?: string
  id?: string
  name: string
  email: string
  role: string
}

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // روابط الـ Navigation
  const baseNavLinks = [
    { href: "/", label: "الرئيسية", icon: Home },
    { href: "/fields", label: "الملاعب", icon: CalendarDays },
  ]

  const userNavLinks = [
    { href: "/my-bookings", label: "حجوزاتي", icon: Clock },
    { href: "/matches", label: "مباريات", icon: Trophy }
  ]

  const navLinks = user ? [...baseNavLinks, ...userNavLinks] : baseNavLinks

  // ✅ دالة جلب المستخدم من localStorage
  const checkUser = useCallback(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)

        // sync الـ token مع الكوكيز
        const token = localStorage.getItem('token')
        if (token) {
          document.cookie = `token=${token}; path=/; max-age=604800`
        }
      } catch (e) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [])

  // ✅ جلب عدد الإشعارات
  const fetchUnreadCount = useCallback(async (userData: UserData | null) => {
    if (!userData) {
      setUnreadCount(0)
      return
    }

    try {
      const userId = userData._id || userData.id
      if (!userId) return

      const res = await fetch(`/api/notifications?userId=${userId}`)
      if (!res.ok) return

      const data = await res.json()
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }, [])

  // ✅ useEffect رئيسي - بيشتغل مرة واحدة
  useEffect(() => {
    // جلب المستخدم عند التحميل
    checkUser()

    // ✅ الحل الصح - Custom Event بدل 'storage'
    // 'storage' event بيشتغل بس في tabs تانية مش نفس الـ tab
    const handleUserChanged = () => {
      checkUser()
    }

    // scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('userChanged', handleUserChanged)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('userChanged', handleUserChanged)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [checkUser])

  // ✅ useEffect منفصل للإشعارات - بيشتغل لما user يتغير
  useEffect(() => {
    fetchUnreadCount(user)

    if (user) {
      const interval = setInterval(() => fetchUnreadCount(user), 30000)
      return () => clearInterval(interval)
    }
  }, [user, fetchUnreadCount])

  // ✅ تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')

    // مسح الكوكيز
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'

    setUser(null)
    setUnreadCount(0)

    // ✅ إطلاق الـ event عشان أي component تاني يتحدث
    window.dispatchEvent(new Event('userChanged'))

    router.push('/')
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white border-b border-gray-100"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={closeMenu}
          >
            <div className="w-10 h-10 bg-gradient-to-l from-blue-600 to-green-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition">
              <span className="text-white font-bold text-xl">⚽</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-l from-blue-600 to-green-600 bg-clip-text text-transparent">
              كوره بوك
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">

            {/* زر الإشعارات */}
            {user && (
              <Link href="/notifications" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-l from-blue-600 to-green-600 text-white text-sm font-bold">
                        {user.name?.slice(0, 2) || "م"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-sm font-medium">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 font-normal">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="w-4 h-4 ml-2" />
                    الملف الشخصي
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/my-bookings')}>
                    <Clock className="w-4 h-4 ml-2" />
                    حجوزاتي
                  </DropdownMenuItem>

                  {/* ✅ زر الأدمن - بيظهر بس لو role = admin */}
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push('/admin')}
                        className="text-blue-600 font-medium"
                      >
                        <Shield className="w-4 h-4 ml-2" />
                        لوحة التحكم
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="w-4 h-4 ml-2" />
                    تسجيل خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">دخول</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-l from-blue-600 to-green-600 text-white">
                    حساب جديد
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">

            {/* Navigation Links */}
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                      isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                    )}
                    onClick={closeMenu}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
            </div>

            <div className="border-t border-gray-200 pt-4 px-2">
              {user ? (
                <div className="space-y-1">
                  {/* User Info */}
                  <div className="flex items-center justify-between px-2 py-3 mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-gradient-to-l from-blue-600 to-green-600 text-white font-bold">
                          {user.name?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {/* إشعارات الموبايل */}
                    <Link href="/notifications" onClick={closeMenu} className="relative">
                      <Button variant="ghost" size="icon">
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { router.push('/profile'); closeMenu() }}
                  >
                    <User className="w-4 h-4" />
                    الملف الشخصي
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => { router.push('/my-bookings'); closeMenu() }}
                  >
                    <Clock className="w-4 h-4" />
                    حجوزاتي
                  </Button>

                  {/* ✅ لوحة التحكم للأدمن فقط */}
                  {user.role === 'admin' && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-blue-600 hover:bg-blue-50"
                      onClick={() => { router.push('/admin'); closeMenu() }}
                    >
                      <Shield className="w-4 h-4" />
                      لوحة التحكم
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-600 hover:bg-red-50"
                    onClick={() => { handleLogout(); closeMenu() }}
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل خروج
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">دخول</Button>
                  </Link>
                  <Link href="/register" onClick={closeMenu}>
                    <Button className="w-full bg-gradient-to-l from-blue-600 to-green-600">
                      حساب جديد
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar