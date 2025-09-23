// lib/auth.ts
import auth from "next-auth"
import GitHub from "next-auth/providers/github"
import { prisma } from "./prisma-client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { Prisma } from "@prisma/client"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
}
