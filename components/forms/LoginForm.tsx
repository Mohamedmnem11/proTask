// "use client"
// import { api } from '@/services/api'
// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"

// // Schema validation
// const loginSchema = z.object({
//   email: z.string()
//     .min(1, "البريد الإلكتروني مطلوب")
//     .email("البريد الإلكتروني غير صحيح"),
//   password: z.string()
//     .min(1, "كلمة المرور مطلوبة")
//     .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
// })

// type LoginFormValues = z.infer<typeof loginSchema>

// const LoginForm = () => {
//   const router = useRouter()
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//   })
// const onSubmit = async (data: LoginFormValues) => {
//   setIsLoading(true)
//   setError("")

//   try {
//     // استدعاء API تسجيل الدخول الحقيقي
//     const response = await api.login({
//       email: data.email,
//       password: data.password
//     })
    
//     console.log("Login successful:", response)
   
    
//     // 🔍 أضف هذا السطر للتصحيح
//     console.log("User object:", response.user)
//     console.log("User ID:", response.user?._id || response.user?.id)
//     // حفظ بيانات المستخدم في localStorage
//     localStorage.setItem('user', JSON.stringify(response.user))
//     localStorage.setItem('token', response.token || 'temp-token')
//     window.dispatchEvent(new Event('userChanged'))
    

//      document.cookie = `token=${response.token || 'temp-token'}; path=/; max-age=604800`
//     // التوجيه للصفحة الرئيسية
//     // router.push("/")
//     const redirect = new URLSearchParams(window.location.search).get('redirect')
//     router.push(redirect || '/')
    
//   } catch (error: any) {
//     setError(error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة")
//   } finally {
//     setIsLoading(false)
//   }
// }
//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader className="text-center">
//         <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
//         <CardDescription>
//           أدخل بياناتك للدخول إلى حسابك
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* Error Message */}
//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
//               <AlertCircle className="w-4 h-4" />
//               {error}
//             </div>
//           )}

//           {/* Email Field */}
//           <div className="space-y-2">
//             <Label htmlFor="email">البريد الإلكتروني</Label>
//             <div className="relative">
//               <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="your@email.com"
//                 className="pr-9"
//                 {...register("email")}
//               />
//             </div>
//             {errors.email && (
//               <p className="text-red-500 text-sm">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password Field */}
//           <div className="space-y-2">
//             <Label htmlFor="password">كلمة المرور</Label>
//             <div className="relative">
//               <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 className="pr-9"
//                 {...register("password")}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-sm">{errors.password.message}</p>
//             )}
//           </div>

//           {/* Forgot Password */}
//           <div className="text-left">
//             <Link
//               href="/forgot-password"
//               className="text-sm text-blue-600 hover:text-blue-700"
//             >
//               نسيت كلمة المرور؟
//             </Link>
//           </div>

//           {/* Submit Button */}
//           <Button
//             type="submit"
//             className="w-full"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 جاري تسجيل الدخول...
//               </div>
//             ) : (
//               "تسجيل الدخول"
//             )}
//           </Button>
//         </form>
//       </CardContent>

//       <CardFooter className="flex justify-center">
//         <p className="text-sm text-gray-600">
//           ليس لديك حساب؟{" "}
//           <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
//             إنشاء حساب جديد
//           </Link>
//         </p>
//       </CardFooter>
//     </Card>
//   )
// }

// export default LoginForm


"use client"
import { api } from '@/services/api'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"

// Schema validation
const loginSchema = z.object({
  email: z.string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  password: z.string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError("")

    try {
      // استدعاء API تسجيل الدخول الحقيقي
      const response = await api.login({
        email: data.email,
        password: data.password
      })
      
      console.log("✅ Login successful:", response)
      
      // 🔍 التحقق من وجود user
      if (!response.user) {
        throw new Error("بيانات المستخدم غير صالحة")
      }

      const userId = response.user?._id || response.user?.id
      console.log("👤 User ID:", userId)
      
      // حفظ بيانات المستخدم في localStorage
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('token', response.token || 'temp-token')
      
      // إرسال حدث للتحديث
      window.dispatchEvent(new Event('userChanged'))
      
      // حفظ في الكوكيز (اختياري)
      document.cookie = `token=${response.token || 'temp-token'}; path=/; max-age=604800`
      
      // التوجيه للصفحة المطلوبة
      const redirect = new URLSearchParams(window.location.search).get('redirect')
      router.push(redirect || '/')
      
    } catch (error: any) {
      // منع ظهور الخطأ في console.error (شيل الـ console.error)
      // console.error("❌ Login error:", error) // ⬅️ علق أو اشيل السطر ده
      
      // رسائل خطأ مخصصة
      if (error.message?.includes('معطل')) {
        setError("هذا الحساب معطل. يرجى التواصل مع الدعم.")
      } else if (error.message?.includes('غير صحيحة')) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
      } else {
        setError(error.message || "حدث خطأ في تسجيل الدخول")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold text-gray-900">تسجيل الدخول</CardTitle>
        <CardDescription className="text-gray-500">
          أدخل بياناتك للدخول إلى حسابك
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="pr-12 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                dir="ltr"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-12 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                dir="ltr"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-left">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base bg-gradient-to-l from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري تسجيل الدخول...
              </div>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-sm text-gray-600">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            إنشاء حساب جديد
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default LoginForm