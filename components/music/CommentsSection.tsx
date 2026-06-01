"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatDuration } from "@/lib/utils";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  timestamp?: number;
  likes: number;
  createdAt: string;
  user: { id: string; name: string; image?: string };
}

interface Props {
  songId: string;
  currentTime?: number;
}

export function CommentsSection({ songId, currentTime }: Props) {
  const { user, isLoggedIn } = useCurrentUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [withTimestamp, setWithTimestamp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/songs/${songId}/comments`)
      .then((r) => r.json())
      .then((d) => {
        setComments(d.comments ?? []);
        setFetching(false);
      });
  }, [songId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !isLoggedIn) return;

    setLoading(true);

    const res = await fetch(`/api/songs/${songId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        timestamp: withTimestamp && currentTime ? Math.floor(currentTime) : null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setComments((prev) => [data.comment, ...prev]);
      setContent("");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle size={16} className="text-white/40" />
        <h3 className="text-sm font-semibold text-white">
          Commentaires ({comments.length})
        </h3>
      </div>

      {/* Formulaire */}
      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0 text-xs font-bold text-purple-400">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ajoute un commentaire..."
              maxLength={500}
              className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
            <Button
              type="submit"
              variant="primary"
              size="icon"
              loading={loading}
              disabled={!content.trim()}
            >
              <Send size={15} />
            </Button>
          </div>

          {currentTime !== undefined && currentTime > 0 && (
            <label className="flex items-center gap-2 text-xs text-white/40 cursor-pointer pl-10">
              <input
                type="checkbox"
                checked={withTimestamp}
                onChange={(e) => setWithTimestamp(e.target.checked)}
                className="accent-purple-500"
              />
              Commenter à {formatDuration(currentTime)}
            </label>
          )}
        </form>
      )}

      {/* Liste */}
      {fetching ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-white/5 animate-pulse rounded w-1/4" />
                <div className="h-3 bg-white/5 animate-pulse rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-6">
          Aucun commentaire — sois le premier !
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-purple-400 overflow-hidden">
                {comment.user.image ? (
                  <Image
                    src={comment.user.image}
                    alt={comment.user.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  comment.user.name[0]?.toUpperCase()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-white">
                    {comment.user.name}
                  </span>
                  {comment.timestamp !== undefined && comment.timestamp !== null && (
                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full">
                      {formatDuration(comment.timestamp)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}