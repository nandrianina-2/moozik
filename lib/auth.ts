import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id        = user.id;
        token.role      = (user as any).role;
        token.isPremium = (user as any).isPremium;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id        = token.id as string;
        session.user.role      = token.role as string;
        session.user.isPremium = token.isPremium as boolean;
      }
      return session;
    },
  },

  events: {
    async signIn({ user }) {
      try {
        const { connectDB } = await import("@/lib/db");
        const Session       = (await import("@/models/Session")).default;
        await connectDB();

        await Session.findOneAndUpdate(
          { user: user.id },
          {
            user:      user.id,
            token:     crypto.randomUUID(),
            userAgent: "Web",
            ip:        "unknown",
            lastSeen:  new Date(),
          },
          { upsert: true, new: true }
        );
      } catch {}
    },

    async signOut() {
      // Nettoyage géré côté client
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const { connectDB }    = await import("@/lib/db");
        const { default: User } = await import("@/models/User");
        const { default: bcrypt } = await import("bcryptjs");

        await connectDB();

        const user = await User.findOne({ email }).select("+password");
        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id:        user._id.toString(),
          name:      user.name,
          email:     user.email,
          image:     user.image,
          role:      user.role,
          isPremium: user.isPremium,
        };
      },
    }),
  ],
});