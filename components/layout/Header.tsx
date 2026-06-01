"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/ui/NotificationBell";
import Link from "next/link";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
      {title && (
        <h1 className="text-base font-semibold text-white truncate">{title}</h1>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <NotificationBell />
        <Link href="/account">
          <Button variant="ghost" size="icon" aria-label="Mon compte">
            <User size={18} />
          </Button>
        </Link>
      </div>
    </header>
  );
}