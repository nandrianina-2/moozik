"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Home, Search, ListMusic, Heart, Radio,
  Shield, LayoutDashboard, Users, Music2,
  Library, History, MoreHorizontal, X,
  Upload, BarChart2, Settings, User,
} from "lucide-react";

const mainLinks = [
  { href: "/dashboard", icon: Home,      label: "Accueil" },
  { href: "/search",    icon: Search,    label: "Recherche" },
  { href: "/playlists", icon: ListMusic, label: "Playlists" },
  { href: "/favorites", icon: Heart,     label: "Favoris" },
];

const moreLinks = [
  { href: "/library",   icon: Library,  label: "Bibliothèque" },
  { href: "/artists",   icon: Users,    label: "Artistes" },
  { href: "/history",   icon: History,  label: "Historique" },
  { href: "/radio",     icon: Radio,    label: "Radio" },
  { href: "/settings",  icon: Settings, label: "Paramètres" },
  { href: "/account",   icon: User,     label: "Mon compte" },
];

const artistMoreLinks = [
  { href: "/studio",            icon: Music2,    label: "Mon studio" },
  { href: "/studio/upload",     icon: Upload,    label: "Ajouter un son" },
  { href: "/studio/analytics",  icon: BarChart2, label: "Analytics" },
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
  const { isAdmin, isArtist } = useCurrentUser();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (pathname === "/player") return null;

  const isAdminPage = pathname.startsWith("/admin");

  if (isAdminPage) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d]/97 backdrop-blur-md border-t border-white/5">
        <div className="flex items-center justify-around px-2 py-2">
          {adminLinks.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={cn(
                "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg min-w-0 transition-all active:scale-90",
                isActive ? "text-purple-400" : "text-white/40"
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[9px] font-medium truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Nav principale */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d]/97 backdrop-blur-md border-t border-white/5">
        <div className="flex items-center justify-around px-2 py-2">
          {mainLinks.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg min-w-0 transition-all active:scale-90",
                isActive ? "text-purple-400" : "text-white/40"
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[10px] font-medium truncate">{label}</span>
              </Link>
            );
          })}

          {/* Bouton Plus */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all active:scale-90",
              drawerOpen ? "text-purple-400" : "text-white/40"
            )}
          >
            <MoreHorizontal size={20} strokeWidth={1.5} />
            <span className="text-[10px] font-medium">Plus</span>
          </button>
        </div>
      </nav>

      {/* Drawer "Plus" */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Panneau */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] rounded-t-2xl border-t border-white/10 shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <span className="text-sm font-semibold text-white">Menu</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-3 py-3 space-y-1 max-h-[60vh] overflow-y-auto pb-8">

              {/* Liens principaux */}
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2">
                Navigation
              </p>
              {moreLinks.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                      isActive
                        ? "bg-purple-500/10 text-purple-400"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon size={18} className={isActive ? "text-purple-400" : "text-white/40"} />
                    <span className="text-sm font-medium">{label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                  </Link>
                );
              })}

              {/* Studio artiste */}
              {isArtist && (
                <>
                  <div className="h-px bg-white/5 my-2" />
                  <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2">
                    Studio
                  </p>
                  {artistMoreLinks.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setDrawerOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                          isActive
                            ? "bg-purple-500/10 text-purple-400"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon size={18} className={isActive ? "text-purple-400" : "text-white/40"} />
                        <span className="text-sm font-medium">{label}</span>
                      </Link>
                    );
                  })}
                </>
              )}

              {/* Admin */}
              {isAdmin && (
                <>
                  <div className="h-px bg-white/5 my-2" />
                  <Link
                    href="/admin"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <Shield size={18} className="text-white/40" />
                    <span className="text-sm font-medium">Administration</span>
                  </Link>
                </>
              )}

            </div>
          </div>
        </>
      )}
    </>
  );
}