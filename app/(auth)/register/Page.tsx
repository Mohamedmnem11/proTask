import { Metadata } from "next"
import RegisterForm from "@/components/forms/RegisterForm"

export const metadata: Metadata = {
  title: "إنشاء حساب جديد - كوره بوك",
  description: "أنشئ حسابك الجديد في كوره بوك وابدأ حجز الملاعب",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Form */}
          <div>
            <RegisterForm />
          </div>

          {/* Right Side - Hero */}
          <div className="hidden md:block">
            <div className="text-center md:text-right">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-l from-blue-600 to-green-600 bg-clip-text text-transparent">
                انضم إلى كوره بوك
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                أفضل منصة لحجز الملاعب في مصر
              </p>
              <div className="bg-gradient-to-l from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-2xl font-bold mb-4">مميزات العضوية:</h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span>
                    حجز سريع وسهل
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span>
                    عروض حصرية للمشتركين
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span>
                    إشعارات تذكير بالمباريات
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-300">✓</span>
                    إلغاء وتعديل الحجوزات بسهولة
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}