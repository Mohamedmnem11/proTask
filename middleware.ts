import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // الصفحات العامة اللي أي حد يقدر يدخلها (حتى من غير تسجيل)
  const publicPaths = ['/', '/fields', '/api']
  
  // الصفحات المفتوحة للجميع (حتى من غير تسجيل)
  const openPaths = ['/login', '/register']
  
  // الصفحات المحمية (محتاجة تسجيل دخول)
  const protectedPaths = ['/my-bookings', '/bookings', '/matches', '/profile']
  
  // صفحة الأدمن (لأدمن بس)
  const adminPaths = ['/admin']
  
  // 🚨 مهم: في middleware مينفعش نستخدم localStorage
  // بدال كده، بنعتمد على الكوكيز
  
  // نجيب التوكن من الكوكيز
  const token = request.cookies.get('token')?.value
  const isLoggedIn = !!token
  
  // للتصحيح
  console.log(`Path: ${path}, Token: ${token}, isLoggedIn: ${isLoggedIn}`)
  
  // لو الصفحة عامة، خلاص
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }
  
  // لو الصفحة مفتوحة (login/register) والمستخدم مسجل دخول، نحوله للرئيسية
  if (openPaths.includes(path) && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // لو الصفحة محتاجة تسجيل والمستخدم مش مسجل، نحوله للوجين
  if (protectedPaths.some(p => path.startsWith(p)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // لو صفحة أدمن والمستخدم مش مسجل، نحوله للوجين
  if (path.startsWith('/admin') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}