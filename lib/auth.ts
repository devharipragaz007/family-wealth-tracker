import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string
      image?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // TODO: Replace with your actual user authentication logic
        // This is a placeholder - implement your database lookup here
        try {
          // Example authentication logic - replace with actual implementation
          const user = {
            id: "1",
            email: credentials.email,
            name: "Demo User",
          }

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          }
          return null
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
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }): Promise<Session> {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export default handler
