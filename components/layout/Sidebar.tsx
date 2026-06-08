"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home, Search, Library, Heart, Radio,
  Music2, Upload, BarChart2, Settings,
  ChevronRight, Users, ListMusic, History, Shield, Crown, WifiOff
} from "lucide-react";
import { AdminLinks } from "./AdminLinks";
import icon from "../../app/icon-192.png";
import Image from "next/image";


const mainLinks = [
  { href: "/dashboard", icon: Home,    label: "Accueil" },
  { href: "/search",    icon: Search,  label: "Recherche" },
  { href: "/library",   icon: Library, label: "Bibliothèque" },
  { href: "/artists",   icon: Users,   label: "Artistes" },
  { href: "/playlists",  icon: ListMusic, label: "Playlists" },
  { href: "/favorites", icon: Heart,   label: "Favoris" },
  { href: "/history",   icon: History,   label: "Historique" },
  { href: "/radio",     icon: Radio,   label: "Radio" },
  { href: "/subscription", icon: Crown, label: "Premium" },
  { href: "/offline-library", icon: WifiOff, label: "Offline" }
];

const artistLinks = [
  { href: "/studio",            icon: Music2,    label: "Mon studio" },
  { href: "/studio/upload",     icon: Upload,    label: "Ajouter un son" },
  { href: "/studio/analytics",  icon: BarChart2, label: "Analytics" },
];

const adminLinks = [
  { href: "/admin",          icon: Shield,    label: "Dashboard" },
  { href: "/admin/artists",  icon: Users,     label: "Artistes" },
  { href: "/admin/library",  icon: Music2,    label: "Bibliothèque" },
  { href: "/admin/users",    icon: Users,     label: "Utilisateurs" },
];

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}

export function NavLink({ href, icon: Icon, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
        "transition-all duration-150 group",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/50 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon
        size={18}
        className={cn(
          "flex-shrink-0 transition-colors",
          isActive ? "text-purple-400" : "text-white/40 group-hover:text-white/70"
        )}
      />
      <span className="truncate">{label}</span>
      {isActive && (
        <ChevronRight size={14} className="ml-auto text-purple-400 flex-shrink-0" />
      )}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 xl:w-64 flex-col border-r border-white/5 bg-[#0d0d0d] flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
          <Image src={icon} alt="Moozik" width={32} height={32} />
        </div>
        <span className="text-lg font-bold tracking-tight">Moozik</span>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {mainLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}

        <div className="pt-4 pb-1 px-3">
          <span className="text-[11px] font-semibold text-white/25 uppercase tracking-widest">
            Studio
          </span>
        </div>

        {/* Section admin — visible uniquement pour les admins */}

        {artistLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
        <AdminLinks />
      </nav>

      {/* Pied de sidebar */}
      <div className="p-3 border-t border-white/5">
        <NavLink href="/settings" icon={Settings} label="Paramètres" />
      </div>
    </aside>
  );
}