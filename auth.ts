import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { DefaultSession } from "next-auth"

// ✅ إضافة types للـ role
declare module "next-auth" {
  interface User {
    role?: string
    id?: string
  }
  interface Session {
    user: {
      role?: string
      id?: string
    } & DefaultSession["user"]
  }
}

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

export const { handlers, signIn, signOut, auth } = NextAuth({
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

        const user = mockUsers.find(user => user.email === credentials.email)

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
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  },
})