"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  user: { name: string };
}

interface FloatingComment extends Comment {
  x: number;
  y: number;
  key: string;
}

export function FloatingComments({ songId }: { songId: string }) {
  const { isPlaying } = usePlayerStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [visible, setVisible] = useState<FloatingComment[]>([]);

  // Charge les commentaires
  useEffect(() => {
    fetch(`/api/songs/${songId}/comments`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments ?? []));
  }, [songId]);

  // Affiche un commentaire aléatoire toutes les 3s si en lecture
  useEffect(() => {
    if (!isPlaying || comments.length === 0) return;

    const interval = setInterval(() => {
      const comment = comments[Math.floor(Math.random() * comments.length)];
      const floating: FloatingComment = {
        ...comment,
        x: 5 + Math.random() * 60,  // 5% à 65% de large
        y: 10 + Math.random() * 70,  // 10% à 80% de haut
        key: `${comment.id}-${Date.now()}`,
      };

      setVisible((prev) => [...prev.slice(-4), floating]); // max 5 visibles

      // Retire après 4s
      setTimeout(() => {
        setVisible((prev) => prev.filter((c) => c.key !== floating.key));
      }, 4000);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, comments]);

  if (comments.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {visible.map((c) => (
        <div
          key={c.key}
          className={cn(
            "absolute max-w-[70%]",
            "bg-black/60 backdrop-blur-sm",
            "text-white text-xs font-medium",
            "px-2.5 py-1.5 rounded-full",
            "border border-white/10",
            "animate-fade-in-up",
            "whitespace-nowrap overflow-hidden text-ellipsis"
          )}
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            animation: "floatUp 4s ease-out forwards",
          }}
        >
          <span className="text-purple-400 mr-1">{c.user.name[0]}:</span>
          {c.content.length > 30 ? c.content.slice(0, 30) + "…" : c.content}
        </div>
      ))}

      <style jsx>{`
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(8px); }
          15%  { opacity: 1; transform: translateY(0); }
          75%  { opacity: 1; transform: translateY(-4px); }
          100% { opacity: 0; transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}