import nextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import prisma from "@/lib/prisma";
import {PrismaAdapter} from '@next-auth/prisma-adapter'

export const authOptions:AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
      GithubProvider({
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!
      }),
      GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      }),
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
              email: { label: "Email", type: "email", placeholder: "test@example.com" },
              password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req){
              const user = prisma.user.findUnique({where: {email: credentials?.email, password: credentials?.password}})
              if(user){
                  return user
              }else{
                  return null
              }
          }
      })    
  ],
  pages: {
      signIn: '/login'
  },
  secret: process.env.NEXTAUTH_URL,
  debug: process.env.NODE_ENV !== "production",
  session: {
      strategy: 'jwt'
  },
  callbacks: {
      jwt({ token, account, user }) {
        if (account) {
          token.accessToken = account.access_token
          token.id = user?.id
        }
        return token
      },
      session({ session, token }) {
          session.user.id = token.id;
          return session;
        },
    }
}