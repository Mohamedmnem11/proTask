import { Metadata } from "next"
import LoginForm from "@/components/forms/LoginForm"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "تسجيل الدخول - كوره بوك",
  description: "سجل دخولك إلى حسابك في كوره بوك",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero */}
          <div className="hidden md:block">
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-l from-blue-600 to-green-600 bg-clip-text text-transparent">
                مرحباً بعودتك!
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                سجل دخولك دلوقتي وابتدى احجز ملاعبك المفضلة
              </p>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">✓</span>
                    </div>
                    <span>أكثر من 50 ملعب في جميع أنحاء مصر</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">✓</span>
                    </div>
                    <span>حجز سهل وآمن في دقائق</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600">✓</span>
                    </div>
                    <span>انضم لمباريات ناقصة لاعبين</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}