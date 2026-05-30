"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, Library, Heart, Radio } from "lucide-react";

const links = [
  { href: "/dashboard", icon: Home,    label: "Accueil" },
  { href: "/search",    icon: Search,  label: "Recherche" },
  { href: "/library",   icon: Library, label: "Librairie" },
  { href: "/favorites", icon: Heart,   label: "Favoris" },
  { href: "/radio",     icon: Radio,   label: "Radio" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-t border-white/5">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
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