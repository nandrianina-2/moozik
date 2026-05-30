"use client";

import { usePlayerStore } from "@/store/playerStore";
import { getAudioEngine } from "@/lib/audioEngine";
import { formatDuration } from "@/lib/utils";

export function ProgressBar() {
  const { progress, duration } = usePlayerStore();

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const seconds = ratio * duration;
    getAudioEngine().seek(seconds);
  }

  const percent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[11px] text-white/30 tabular-nums w-8 text-right">
        {formatDuration(progress)}
      </span>

      <div
        className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group relative"
        onClick={handleClick}
      >
        <div
          className="h-full bg-white rounded-full relative transition-all group-hover:bg-purple-400"
          style={{ width: `${percent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 translate-x-1/2 transition-opacity" />
        </div>
      </div>

      <span className="text-[11px] text-white/30 tabular-nums w-8">
        {formatDuration(duration)}
      </span>
    </div>
  );
}