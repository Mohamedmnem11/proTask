'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

// المكون الداخلي الذي يستخدم useSearchParams
function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('الرابط غير صحيح. اطلب رابط جديد.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين')
      return
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ')
      }

      setSuccess(true)

      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">تم تغيير كلمة المرور! 🎉</h2>
            <p className="text-gray-600 mb-8">
              تم تغيير كلمة المرور بنجاح. سيتم توجيهك لصفحة تسجيل الدخول...
            </p>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-l from-blue-600 to-green-600">
                تسجيل الدخول الآن
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">رابط غير صحيح</h2>
            <p className="text-gray-600 mb-8">
              الرابط غير صحيح أو منتهي الصلاحية. اطلب رابطاً جديداً.
            </p>
            <Link href="/forgot-password">
              <Button className="w-full bg-gradient-to-l from-blue-600 to-green-600">
                طلب رابط جديد
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-gradient-to-l from-blue-600 to-green-600 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">⚽</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">كلمة المرور الجديدة</CardTitle>
          <CardDescription>
            أدخل كلمة المرور الجديدة لحسابك
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">كلمة المرور الجديدة</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-9 pl-9"
                  minLength={6}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pr-9 pl-9 ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-400'
                      : confirmPassword && password === confirmPassword
                      ? 'border-green-400'
                      : ''
                  }`}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && (
                <p className={`text-xs flex items-center gap-1 ${
                  password === confirmPassword ? 'text-green-600' : 'text-red-500'
                }`}>
                  {password === confirmPassword ? (
                    <><CheckCircle className="w-3 h-3" /> كلمتا المرور متطابقتان</>
                  ) : (
                    <><AlertCircle className="w-3 h-3" /> كلمتا المرور غير متطابقتين</>
                  )}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-l from-blue-600 to-green-600"
              disabled={loading || (!!confirmPassword && password !== confirmPassword)}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحفظ...
                </div>
              ) : (
                'حفظ كلمة المرور الجديدة'
              )}
            </Button>

            <div className="text-center">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                طلب رابط جديد
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// المكون الرئيسي مع Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}