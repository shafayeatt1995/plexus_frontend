import { apiLogin, apiRefreshToken } from "@/server/auth/auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  pages: { signIn: "/login", signOut: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        try {
          if (credentials?.token) {
            return await apiRefreshToken(credentials);
          } else {
            return await apiLogin(credentials);
          }
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      const accessToken = token.token;

      session.user = { ...token.user, accessToken };
      return session;
    },
  },
};
