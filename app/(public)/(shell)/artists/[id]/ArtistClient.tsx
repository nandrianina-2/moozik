"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { UserPlus, UserCheck } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { Artist } from "@/types";

interface Props {
  artist: Artist;
}

export function ArtistClient({ artist }: Props) {
  const { isLoggedIn } = useCurrentUser();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [count, setCount]         = useState(artist.followers);

  // Vérifie si déjà suivi
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`/api/artists/${artist.id}/follow`)
      .then((r) => r.json())
      .then((d) => setFollowing(d.following ?? false))
      .catch(() => {});
  }, [artist.id, isLoggedIn]);

  async function handleFollow() {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`/api/artists/${artist.id}/follow`, {
        method: "POST",
      });
      const data = await res.json();
      setFollowing(data.following);
      setCount((prev) => data.following ? prev + 1 : prev - 1);
    } catch {
      console.error("Erreur follow");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={following ? "secondary" : "primary"}
        size="sm"
        onClick={handleFollow}
        loading={loading}
      >
        {following ? (
          <><UserCheck size={15} /> Abonné</>
        ) : (
          <><UserPlus size={15} /> Suivre</>
        )}
      </Button>
      <span className="text-xs text-white/40">
        {count.toLocaleString()} abonnés
      </span>
    </div>
  );
}