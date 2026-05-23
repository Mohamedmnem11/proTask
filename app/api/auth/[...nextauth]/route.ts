import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"

// ده مؤقت هنستخدمه بعد ما نضيف قاعدة البيانات
const mockUsers = [
  {
    id: "1",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    password: "123456",
    role: "user"
  },
  {
    id: "2",
    name: "محمد علي",
    email: "admin@example.com",
    password: "admin123",
    role: "admin"
  }
]

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // البحث عن المستخدم
        const user = mockUsers.find(user => user.email === credentials.email)

        // التحقق من كلمة المرور (في الواقع هنشفرها)
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }