import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/providers";
import { Toaster } from "react-hot-toast";
// import { NotificationBell } from '@/components/NotificationBell'
const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "كوره بوك - حجز ملاعب الكورة",
  description: "أول منصة متخصصة في حجز ملاعب الكورة في مصر",
  keywords: "حجز ملاعب, ملاعب كرة قدم, حجز ملاعب اونلاين, كوره بوك",
  authors: [{ name: "كوره بوك" }],
  openGraph: {
    title: "كوره بوك - حجز ملاعب الكورة",
    description: "احجز ملعبك الآن بأسهل طريقة",
    url: "https://koorabook.com",
    siteName: "كوره بوك",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        // loading: "lazy"
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-sans antialiased`}>
        <Providers>
          {" "}
          {/* 👈 لف كل الموقع هنا */}
          <Navbar />
          {/* <NotificationBell /> */}
          <main className="min-h-screen bg-gray-50">{children}</main>
          <Footer />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "Cairo, sans-serif",
                direction: "rtl",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
