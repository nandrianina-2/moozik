"use client";

import { User, Bell, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fermer si clic en dehors
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
      {title && (
        <h1 className="text-base font-semibold text-white truncate">{title}</h1>
      )}

      <div className="flex items-center gap-2 ml-auto" ref={ref}>
        <NotificationBell />

        {/* Bouton user */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Mon compte"
            onClick={() => setOpen((v) => !v)}
            className={open ? "text-purple-400 bg-white/5" : ""}
          >
            <User size={18} />
          </Button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-white/75 hover:bg-white/5 hover:text-white transition-colors"
              >
                <UserCircle size={16} className="text-white/35" />
                Accéder au compte
              </Link>

              <div className="h-px bg-white/5" />

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-3 px-4 py-3 text-sm text-red-400/80 hover:bg-red-500/8 hover:text-red-400 transition-colors w-full text-left"
              >
                <LogOut size={16} className="text-red-500/50" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}