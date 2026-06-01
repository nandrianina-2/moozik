"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { NavLink } from "./Sidebar";
import { Shield, Users, Music2, BarChart2 } from "lucide-react";

const adminLinks = [
  { href: "/admin",         icon: Shield, label: "Dashboard admin" },
  { href: "/admin/artists", icon: Users,  label: "Artistes" },
  { href: "/admin/library", icon: Music2, label: "Bibliothèque" },
  { href: "/admin/users",   icon: Users,  label: "Utilisateurs" },
];

export function AdminLinks() {
  const { isAdmin } = useCurrentUser();
  if (!isAdmin) return null;

  return (
    <>
      <div className="pt-4 pb-1 px-3">
        <span className="text-[11px] font-semibold text-white/25 uppercase tracking-widest">
          Admin
        </span>
      </div>
      {adminLinks.map((link) => (
        <NavLink key={link.href} {...link} />
      ))}
    </>
  );
}