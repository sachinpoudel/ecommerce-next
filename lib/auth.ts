// lib/auth.ts
import auth from "next-auth"
import GitHub from "next-auth/providers/github"
import { prisma } from "./prisma-client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Prisma } from "@prisma/client"

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GitHub({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//     }),
//   ],
//   session: { strategy: "jwt" as string },
//   secret: process.env.NEXTAUTH_SECRET as string | undefined,
// }
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!isValid) return null

        return { id: user.id, email: user.email, role: user.role}
      },
    }),
  ],
  session: { strategy: "jwt" as const},
  secret: process.env.NEXTAUTH_SECRET,
  callbacks:{
    async jwt({token, user} : {token:any , user:any}) {
      if(user){
        token.user = user
      }
      return token
    },
    async session({session, token} : {session:any , token:any}) {
      if(token?.user){
        session.user = token.user
      }
      return session
    }
  }
}
