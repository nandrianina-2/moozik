"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { TrendingUp, Heart, Music2, Eye } from "lucide-react";
import { formatCount, cn } from "@/lib/utils";

type Period = "7d" | "30d" | "90d";

interface AnalyticsData {
  period: string;
  totalStreams: number;
  totalLikes: number;
  totalSongs: number;
  streamsByDay: { date: string; streams: number }[];
  topSongs: { title: string; streams: number }[];
  allSongs: { id: string; title: string; streamCount: number; likesCount: number }[];
}

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "7 derniers jours",
  "30d": "30 derniers jours",
  "90d": "90 derniers jours",
};

export function AnalyticsClient() {
  const [period, setPeriod] = useState<Period>("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, [period]);

  // Tooltip custom
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-white/40 mb-1">{label}</p>
        <p className="text-sm font-semibold text-purple-400">
          {payload[0].value} streams
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="px-4 md:px-6 py-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const maxStream = Math.max(...(data.topSongs.map((s) => s.streams)), 1);

  return (
    <div className="px-4 md:px-6 py-6 space-y-6">

      {/* Sélecteur période */}
      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {(["7d", "30d", "90d"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-medium transition-all",
              period === p
                ? "bg-white/10 text-white"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : "90 jours"}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { icon: TrendingUp, label: "Streams",  value: formatCount(data.totalStreams), color: "text-purple-400", bg: "bg-purple-500/10" },
          { icon: Heart,      label: "Likes",    value: formatCount(data.totalLikes),  color: "text-pink-400",   bg: "bg-pink-500/10" },
          { icon: Music2,     label: "Sons",     value: data.totalSongs,               color: "text-blue-400",   bg: "bg-blue-500/10" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className="bg-white/5 rounded-xl p-4 border border-white/5"
          >
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/40 mt-0.5">
              {label} · {PERIOD_LABELS[period]}
            </p>
          </div>
        ))}
      </div>

      {/* Graphique streams par jour */}
      <div className="bg-white/5 rounded-xl border border-white/5 p-4">
        <h2 className="text-sm font-semibold text-white mb-4">
          Streams par jour
        </h2>
        {data.streamsByDay.every((d) => d.streams === 0) ? (
          <div className="flex items-center justify-center h-32 text-white/30 text-sm">
            Aucun stream sur cette période
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data.streamsByDay}>
              <defs>
                <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(d) => {
                  const date = new Date(d);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="streams"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#streamGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top sons */}
      {data.topSongs.length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/5 p-4">
          <h2 className="text-sm font-semibold text-white mb-4">
            Top sons sur la période
          </h2>
          <div className="space-y-3">
            {data.topSongs.map((song, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white truncate flex-1 mr-3">
                    {song.title}
                  </p>
                  <span className="text-xs text-white/40 flex-shrink-0">
                    {formatCount(song.streams)}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${(song.streams / maxStream) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tous les sons */}
      <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Tous mes sons</h2>
        </div>
        {data.allSongs.map((song) => (
          <div
            key={song.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
              <Music2 size={14} className="text-purple-400" />
            </div>
            <p className="text-sm text-white flex-1 truncate">{song.title}</p>
            <div className="flex items-center gap-3 text-xs text-white/30">
              <span className="flex items-center gap-1">
                <TrendingUp size={11} className="text-purple-400" />
                {formatCount(song.streamCount)}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={11} className="text-pink-400" />
                {formatCount(song.likesCount)}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}