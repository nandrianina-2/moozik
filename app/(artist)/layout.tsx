import { AppShell } from "@/components/layout/AppShell";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");

  if (session.user.role !== "artist" && session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <AppShell>{children}</AppShell>;
}