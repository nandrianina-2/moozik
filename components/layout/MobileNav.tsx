"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";
import {
  Home, Search, ListMusic,
  Heart, Radio, Shield,
  Music2, Users, LayoutDashboard,
} from "lucide-react";

const userLinks = [
  { href: "/dashboard", icon: Home,      label: "Accueil" },
  { href: "/search",    icon: Search,    label: "Recherche" },
  { href: "/playlists", icon: ListMusic, label: "Playlists" },
  { href: "/favorites", icon: Heart,     label: "Favoris" },
  { href: "/radio",     icon: Radio,     label: "Radio" },
];

const userLinksWithAdmin = [
  { href: "/dashboard", icon: Home,      label: "Accueil" },
  { href: "/search",    icon: Search,    label: "Recherche" },
  { href: "/playlists", icon: ListMusic, label: "Playlists" },
  { href: "/favorites", icon: Heart,     label: "Favoris" },
  { href: "/admin",     icon: Shield,    label: "Admin" },
];

const adminLinks = [
  { href: "/dashboard",     icon: Home,            label: "Accueil" },
  { href: "/admin",         icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/artists", icon: Users,           label: "Artistes" },
  { href: "/admin/library", icon: Music2,          label: "Library" },
  { href: "/admin/users",   icon: Users,           label: "Users" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isAdmin } = useCurrentUser();

  if (pathname === "/player") return null;

  // Sur les pages admin → nav admin
  // Sur les autres pages + admin → nav normale avec bouton admin
  // Sur les autres pages sans admin → nav normale
  const links = pathname.startsWith("/admin")
    ? adminLinks
    : isAdmin
    ? userLinksWithAdmin
    : userLinks;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d]/97 backdrop-blur-md border-t border-white/5">
      <div className="flex items-center justify-around px-2 py-2">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && href !== "/" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg min-w-0",
                "transition-all duration-150 active:scale-90",
                isActive ? "text-purple-400" : "text-white/40"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}