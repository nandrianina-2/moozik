import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";

export default async function RootPage() {
  const session = await auth();

  // Connecté → dashboard
  if (session) redirect("/dashboard");

  // Non connecté → landing
  return <LandingPage />;
}