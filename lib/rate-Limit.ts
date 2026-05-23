// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

// استخدمها في API Routes
const { success } = await ratelimit.limit(ip);
if (!success) {
  return NextResponse.json({ error: 'طلبات كتيرة' }, { status: 429 })
}