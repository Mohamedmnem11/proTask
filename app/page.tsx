import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Clock, Users, MapPin, Star, Trophy, Shield, CreditCard } from "lucide-react"

// بيانات تجريبية للملاعب
const featuredFields = [
  {
    id: 1,
    name: "ملعب النادي الأهلي",
    location: "الجزيرة",
    price: 250,
    rating: 4.8,
    image: "/images/field1.jpg",
    type: "عشب طبيعي",
    reviews: 128,
  },
  {
    id: 2,
    name: "ملعب الزمالك",
    location: "ميت عقبة",
    price: 200,
    rating: 4.6,
    image: "/images/field2.jpg",
    type: "نجيل صناعي",
    reviews: 95,
  },
  {
    id: 3,
    name: "ملعب القاهرة الدولي",
    location: "مدينة نصر",
    price: 300,
    rating: 4.9,
    image: "/images/field3.jpg",
    type: "عشب طبيعي",
    reviews: 256,
  },
  {
    id: 4,
    name: "ملعب بتروسبورت",
    location: "التجمع الخامس",
    price: 280,
    rating: 4.7,
    image: "/images/field4.jpg",
    type: "عشب طبيعي",
    reviews: 182,
  },
  {
    id: 5,
    name: "ملعب الدفاع الجوي",
    location: "العباسية",
    price: 220,
    rating: 4.5,
    image: "/images/field5.jpg",
    type: "نجيل صناعي",
    reviews: 67,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-l from-blue-600 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              احجز ملعبك الآن
              <br />
              <span className="text-3xl md:text-4xl text-yellow-300">بأسهل طريقة</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              اختر من بين أفضل الملاعب في مصر واستمتع بتجربة حجز سلسة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fields">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  عرض الملاعب
                </Button>
              </Link>
              <Link href="/bookings/new/by-time">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10">
                  حجز سريع
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300">+50</div>
              <div className="text-sm opacity-80">ملعب</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300">+1000</div>
              <div className="text-sm opacity-80">حجز شهرياً</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300">+5000</div>
              <div className="text-sm opacity-80">لاعب</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300">4.8</div>
              <div className="text-sm opacity-80">تقييم</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            ليه تختار كوره بوك؟
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            منصتك الأولى لحجز الملاعب في مصر بكل سهولة وأمان
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">حجز سهل وسريع</h3>
                <p className="text-gray-600">
                  احجز ملعبك في دقائق بخطوات بسيطة وواضحة
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">مرونة في المواعيد</h3>
                <p className="text-gray-600">
                  اختر الوقت المناسب لك من 8 صباحاً لـ 12 منتصف الليل
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">انضم لمباريات ناقصة</h3>
                <p className="text-gray-600">
                  لو عايز تلعب ومش لاقي فريق، انضم لمباراة ناقصة لاعبين
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">حجوزات موثقة</h3>
                <p className="text-gray-600">
                  نظام حجز آمن مع إمكانية التعديل والإلغاء
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Fields */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              أشهر الملاعب
            </h2>
            <Link href="/fields" className="text-blue-600 hover:text-blue-700 font-medium">
              عرض الكل →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredFields.map((field) => (
              <Card key={field.id} className="overflow-hidden hover:shadow-lg transition group">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 right-4 text-white">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{field.rating}</span>
                      <span className="text-sm opacity-80">({field.reviews})</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition">
                    {field.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{field.location}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {field.type}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {field.price} ج/ساعة
                    </span>
                  </div>
                  <Link href={`/fields/${field.id}`}>
                    <Button className="w-full">احجز الآن</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            ازاي تبدأ؟
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            ثلاث خطوات بسيطة تفصلك عن الاستمتاع بمباراتك
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                ١
              </div>
              <h3 className="text-xl font-bold mb-2">اختر الملعب</h3>
              <p className="text-gray-600">
                تصفح الملاعب المتاحة واختار الأنسب ليك
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                ٢
              </div>
              <h3 className="text-xl font-bold mb-2">حدد الموعد</h3>
              <p className="text-gray-600">
                اختر اليوم والساعة المناسبين لك
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                ٣
              </div>
              <h3 className="text-xl font-bold mb-2">أكد الحجز</h3>
              <p className="text-gray-600">
                أكد الحجز واستمتع بالمباراة مع أصحابك
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-l from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            جاهز تلعب؟
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            سجل دلوقتي واستمتع بأفضل تجربة حجز ملاعب في مصر
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                إنشاء حساب جديد
              </Button>
            </Link>
            <Link href="/fields">
              <Button size="lg" variant="outline" className="text-lg px-8 text-blue-950 border-white hover:bg-white/10 hover:text-white">
                تصفح الملاعب
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}