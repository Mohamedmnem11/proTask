import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

// دالة مساعدة للتحقق من الـ rate limit
export async function checkRateLimit(ip: string) {
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'طلبات كتيرة، حاول مرة أخرى بعد قليل' },
        { status: 429 }
      )
    }
  }
  
  return { success: true }
}

// استخدمها في API Routes كده:
// const ip = request.headers.get('x-forwarded-for') || 'anonymous'
// const rateCheck = await checkRateLimit(ip)
// if (!rateCheck.success) return rateCheck.response