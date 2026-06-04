"use client";

import { useState } from "react";
import { Search, Shield, ShieldOff, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  isPremium: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export function UsersClient({ users }: { users: UserRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "admin" | "artist" | "user">("all");
  const [list, setList] = useState(users);

  const filtered = list.filter((u) => {
    const matchQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchQuery && matchFilter;
  });

  async function handleRoleChange(userId: string, newRole: string) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      setList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      if (newRole === "artist") {
        alert("Rôle changé en artiste. L'utilisateur doit se reconnecter pour accéder au studio.");
      }
    }
  }

  async function handleTogglePremium(userId: string, current: boolean) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPremium: !current }),
    });
    setList((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isPremium: !current } : u
      )
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 space-y-4">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(["all", "admin", "artist", "user"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                filter === f
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {f === "all" ? "Tous" : f}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/30">{filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}</p>

      {/* Table */}
      <div className="bg-white/3 rounded-xl border border-white/5 overflow-hidden">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-400">
              {user.name[0]?.toUpperCase()}
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate">
                  {user.name}
                </p>
                {user.isPremium && (
                  <Crown size={12} className="text-yellow-400 flex-shrink-0" />
                )}
                {!user.emailVerified && (
                  <span className="text-[10px] text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    Non vérifié
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 truncate">{user.email}</p>
              <p className="text-[10px] text-white/20 mt-0.5">{user.createdAt}</p>
            </div>

            {/* Rôle */}
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              className="text-xs bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
            >
              <option value="user">user</option>
              <option value="artist">artist</option>
              <option value="admin">admin</option>
            </select>

            {/* Premium toggle */}
            <button
              onClick={() => handleTogglePremium(user.id, user.isPremium)}
              title={user.isPremium ? "Retirer Premium" : "Donner Premium"}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                user.isPremium
                  ? "text-yellow-400 hover:text-yellow-300 bg-yellow-400/10"
                  : "text-white/20 hover:text-white/50"
              )}
            >
              <Crown size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}