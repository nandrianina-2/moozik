import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "next-auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

interface ExtendedUser extends User {
  role?: string;
  isPremium?: boolean;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as ExtendedUser;
        token.id = u.id;
        token.role = u.role;
        token.isPremium = u.isPremium;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isPremium = token.isPremium as boolean;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        // Imports dynamiques — jamais au niveau module
        const { connectDB } = await import("@/lib/db");
        const { default: User } = await import("@/models/User");
        const { default: bcrypt } = await import("bcryptjs");
        await connectDB();
        const user = await User.findOne({ email }).select("+password");
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          isPremium: user.isPremium,
        };
      },
    }),
  ],
});