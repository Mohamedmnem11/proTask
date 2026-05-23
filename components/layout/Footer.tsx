import Link from "next/link"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Phone, 
  Mail, 
  MapPin,
  Send,
  Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-l from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚽</span>
              </div>
              <h3 className="text-white text-xl font-bold">كوره بوك</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              أول منصة متخصصة في حجز الملاعب الرياضية في مصر. نوفر لك أفضل الملاعب بأسعار مناسبة وتجربة حجز سلسة.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition flex items-center gap-2">
                  <Send className="w-3 h-3" />
                  عن كوره بوك
                </Link>
              </li>
              <li>
                <Link href="/fields" className="hover:text-white transition flex items-center gap-2">
                  <Send className="w-3 h-3" />
                  الملاعب
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition flex items-center gap-2">
                  <Send className="w-3 h-3" />
                  كيف يعمل الموقع
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition flex items-center gap-2">
                  <Send className="w-3 h-3" />
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition flex items-center gap-2">
                  <Send className="w-3 h-3" />
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">اتصل بنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">الهاتف</div>
                  <a href="tel:01129255054" className="hover:text-white transition">
                    01129255054
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">البريد الإلكتروني</div>
                  <a href="mailto:info@koorabook.com" className="hover:text-white transition">
                    info@koorabook.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">العنوان</div>
                  <span>القاهرة، مصر</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">النشرة البريدية</h4>
            <p className="text-sm mb-4">
              اشترك الآن ليصلك كل جديد عن العروض والمباريات
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
              />
              <Button className="bg-gradient-to-l from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                اشترك الآن
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-right">
              © {currentYear} كوره بوك - جميع الحقوق محفوظة
            </p>
            <p className="text-sm flex items-center gap-1">
              صنع بكل <Heart className="w-4 h-4 text-red-500 fill-red-500" /> في مصر
            </p>
            <div className="flex gap-4">
              <Link href="/terms" className="text-sm hover:text-white transition">
                الشروط والأحكام
              </Link>
              <Link href="/privacy" className="text-sm hover:text-white transition">
                سياسة الخصوصية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer