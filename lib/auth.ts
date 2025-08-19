import NextAuth, { type NextAuthOptions, type DefaultSession, type DefaultUser } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"
import type { Adapter } from "next-auth/adapters"

const prisma = new PrismaClient()

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name?: string | null
    role?: string
  }
}

export const authOptions: NextAuthOptions = {
  // @ts-ignore - PrismaAdapter has a type error with the latest NextAuth version
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.hashedPassword) {
            throw new Error('Invalid email or password')
          }

          const isPasswordValid = await compare(credentials.password, user.hashedPassword)

          if (!isPasswordValid) {
            throw new Error('Invalid email or password')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            emailVerified: user.emailVerified
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    })
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? ''; // Ensure email is always a string
        token.name = user.name ?? null;
        token.role = (user as any).role ?? 'user'; // Default role to 'user' if not provided
        // Add emailVerified to the token
        token.emailVerified = (user as any).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
        (session.user as any).role = token.role as string;
        // Add emailVerified to the session
        (session.user as any).emailVerified = token.emailVerified;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export default handler
