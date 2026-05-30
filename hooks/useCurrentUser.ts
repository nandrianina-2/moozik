"use client";

import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: status === "loading",
    isLoggedIn: status === "authenticated",
    isAdmin: session?.user?.role === "admin",
    isArtist: session?.user?.role === "artist" || session?.user?.role === "admin",
    isPremium: session?.user?.isPremium ?? false,
  };
}