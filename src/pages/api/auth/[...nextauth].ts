import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import type { Provider } from "next-auth/providers";

const TestUserId = "test-user-1";

const testCredentialProviders: Provider[] = env.TEST_USER_SECRET
  ? [
      CredentialsProvider({
        name: "Test user secret",
        credentials: {
          secret: { label: "Test user secret", type: "password" },
        },
        async authorize(credentials) {
          if (credentials?.secret === env.TEST_USER_SECRET) {
            let user = await prisma.user.findFirst({
              where: {
                id: TestUserId,
              },
            });
            if (user == null) {
              user = {
                id: TestUserId,
                name: "Test User",
                email: "test@local.host",
                emailVerified: null,
                image: null,
              };
              await prisma.user.create({
                data: user,
              });
            }
            return user;
          }
          return null;
        },
      }),
    ]
  : [];

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, token, user }) {
      if (session.user) {
        if (user) {
          // this works for external IDP login
          session.user.id = user.id;
        } else if (token.sub) {
          // this is needed to make test user work
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    ...testCredentialProviders,
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // ...add more providers here
  ],
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
