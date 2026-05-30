"use client";

import { useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/Button";
import { Play, UserPlus, UserCheck } from "lucide-react";
import type { Artist, Song } from "@/types";

interface Props {
  artist: Artist;
}

export function ArtistClient({ artist }: Props) {
  const [following, setFollowing] = useState(false);

  async function handleFollow() {
    setFollowing((prev) => !prev);
    await fetch(`/api/artists/${artist.id}/follow`, { method: "POST" });
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={following ? "secondary" : "primary"}
        size="sm"
        onClick={handleFollow}
      >
        {following ? (
          <><UserCheck size={15} /> Abonné</>
        ) : (
          <><UserPlus size={15} /> Suivre</>
        )}
      </Button>
    </div>
  );
}