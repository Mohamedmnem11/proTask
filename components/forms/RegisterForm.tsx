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
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

// Schema validation
const registerSchema = z.object({
  name: z.string()
    .min(1, "الاسم مطلوب")
    .min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صحيح"),
  phone: z.string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صحيح (يبدأ بـ 010/011/012/015)"),
  password: z.string()
    .min(1, "كلمة المرور مطلوبة")
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "يجب أن تحتوي على حرف كبير وصغير ورقم"),
  confirmPassword: z.string()
    .min(1, "تأكيد كلمة المرور مطلوب"),
  agreeTerms: z.boolean()
    .refine(val => val === true, "يجب الموافقة على الشروط والأحكام")
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterForm = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeTerms: false
    }
  })

  const password = watch("password")

  // Password strength checker
  const getPasswordStrength = () => {
    if (!password) return null
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    
    if (strength <= 2) return { text: "ضعيفة", color: "text-red-500", bg: "bg-red-500" }
    if (strength === 3) return { text: "متوسطة", color: "text-yellow-500", bg: "bg-yellow-500" }
    return { text: "قوية", color: "text-green-500", bg: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength()

  const onSubmit = async (data: RegisterFormValues) => {
  setIsLoading(true)
  setError("")

  try {
    // استدعاء API التسجيل الحقيقي
    const response = await api.register({
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone
    })
    
    console.log("Registration successful:", response)
    setSuccess(true)
    
    // بعد 2 ثانية ننقل لصفحة الدخول
    setTimeout(() => {
      router.push("/login?registered=true")
    }, 2000)
    
  } catch (error: any) {
    setError(error.message || "حدث خطأ في التسجيل. حاول مرة أخرى")
  } finally {
    setIsLoading(false)
  }
}
  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">تم التسجيل بنجاح!</h3>
          <p className="text-gray-600 mb-4">
            سيتم تحويلك إلى صفحة تسجيل الدخول خلال ثواني
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle>
        <CardDescription>
          أدخل بياناتك لإنشاء حساب في كوره بوك
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="name"
                placeholder="محمد أحمد"
                className="pr-9"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="pr-9"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="phone"
                placeholder="01012345678"
                className="pr-9"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-9"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full", passwordStrength.bg)}
                      style={{ 
                        width: `${
                          (passwordStrength.text === "قوية" ? 100 : 
                           passwordStrength.text === "متوسطة" ? 66 : 33)
                        }%` 
                      }}
                    />
                  </div>
                  <span className={cn("text-xs font-medium", passwordStrength.color)}>
                    {passwordStrength.text}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  يجب أن تحتوي على حرف كبير وصغير ورقم على الأقل
                </p>
              </div>
            )}
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-9"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agreeTerms"
              className="mt-1"
              {...register("agreeTerms")}
            />
            <Label htmlFor="agreeTerms" className="text-sm text-gray-600">
              أوافق على{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                شروط الاستخدام
              </Link>{" "}
              و{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                سياسة الخصوصية
              </Link>
            </Label>
          </div>
          {errors.agreeTerms && (
            <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري إنشاء الحساب...
              </div>
            ) : (
              "إنشاء حساب"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-600">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            تسجيل الدخول
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default RegisterForm