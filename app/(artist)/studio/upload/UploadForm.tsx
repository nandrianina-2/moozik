"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {
  Upload, Music2, Image as ImageIcon,
  X, Check, Loader2, ChevronLeft, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, slugify } from "@/lib/utils";
import Link from "next/link";

type Genre =
  | "Electronic" | "Hip-Hop" | "R&B" | "Pop" | "Rock"
  | "Jazz" | "Soul" | "Afrobeat" | "Reggae" | "Classical"
  | "Synthwave" | "Alternative" | "Indie" | "Dance";

const GENRES: Genre[] = [
  "Electronic", "Hip-Hop", "R&B", "Pop", "Rock",
  "Jazz", "Soul", "Afrobeat", "Reggae", "Classical",
  "Synthwave", "Alternative", "Indie", "Dance",
];

type ReleaseType = "now" | "past" | "scheduled";
type Step = "form" | "uploading" | "success" | "error";

export function UploadForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [lyrics, setLyrics] = useState("");
  const [releaseType, setReleaseType] = useState<ReleaseType>("now");
  const [releaseDate, setReleaseDate] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const autoSlug = title.trim() ? slugify(title) : "";
  const today = new Date().toISOString().split("T")[0];

  const onDropAudio = useCallback((files: File[]) => {
    if (files[0]) setAudioFile(files[0]);
  }, []);

  const { getRootProps: getAudioProps, getInputProps: getAudioInput, isDragActive } =
    useDropzone({
      onDrop: onDropAudio,
      accept: { "audio/*": [".mp3", ".wav", ".flac", ".aac", ".ogg"] },
      maxFiles: 1,
    });

  const onDropCover = useCallback((files: File[]) => {
    if (files[0]) {
      setCoverFile(files[0]);
      setCoverPreview(URL.createObjectURL(files[0]));
    }
  }, []);

  const { getRootProps: getCoverProps, getInputProps: getCoverInput } =
    useDropzone({
      onDrop: onDropCover,
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      maxFiles: 1,
    });

  function toggleGenre(g: Genre) {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  function getFinalReleaseDate(): Date {
    if (releaseType === "now") return new Date();
    if (releaseDate) return new Date(releaseDate);
    return new Date();
  }

  function isScheduled(): boolean {
    if (releaseType !== "scheduled" || !releaseDate) return false;
    return new Date(releaseDate) > new Date();
  }

  async function uploadToCloudinary(file: File, type: "video" | "image") {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "moozik_unsigned");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${type}/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) throw new Error("Upload échoué");
    return (await res.json()).secure_url as string;
  }

  async function getDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const a = document.createElement("audio");
      a.src = URL.createObjectURL(file);
      a.onloadedmetadata = () => resolve(Math.floor(a.duration));
      a.onerror = () => resolve(0);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!audioFile || !title.trim()) return;
    setStep("uploading");
    setProgress(0);

    try {
      setProgress(20);
      const audioUrl = await uploadToCloudinary(audioFile, "video");

      setProgress(50);
      let coverUrl: string | undefined;
      if (coverFile) coverUrl = await uploadToCloudinary(coverFile, "image");

      setProgress(70);
      const duration = await getDuration(audioFile);

      setProgress(85);
      const scheduled = isScheduled();
      const finalDate = getFinalReleaseDate();

      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          audioUrl,
          coverUrl,
          duration,
          genres,
          lyrics: lyrics.trim() || undefined,
          releaseDate: finalDate.toISOString(),
          isPublished: !scheduled,
          scheduledAt: scheduled ? finalDate.toISOString() : undefined,
        }),
      });

      if (!res.ok) throw new Error("Erreur sauvegarde");

      setProgress(100);
      setStep("success");
      setTimeout(() => router.push("/studio"), 2000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur lors de l'upload. Vérifie ta connexion.");
      setStep("error");
    }
  }

  if (step === "uploading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6">
        <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center">
          <Loader2 size={36} className="text-purple-400 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-white mb-1">Upload en cours...</p>
          <p className="text-sm text-white/40">{progress}%</p>
        </div>
        <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-white/30">
          {progress < 50 ? "Upload audio..." :
           progress < 70 ? "Upload cover..." :
           progress < 90 ? "Traitement..." : "Finalisation..."}
        </p>
      </div>
    );
  }

  if (step === "success") {
    const scheduled = isScheduled();
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
          {scheduled ? (
            <Calendar size={36} className="text-green-400" />
          ) : (
            <Check size={36} className="text-green-400" />
          )}
        </div>
        <p className="text-lg font-bold text-white">
          {scheduled ? "Son planifié !" : "Son publié avec succès !"}
        </p>
        {scheduled && releaseDate && (
          <p className="text-sm text-white/40">
            Sortie prévue le{" "}
            {new Date(releaseDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <p className="text-sm text-white/30">Redirection vers le studio...</p>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
          <X size={36} className="text-red-400" />
        </div>
        <p className="text-lg font-bold text-white">Erreur</p>
        <p className="text-sm text-white/40 text-center">{errorMsg}</p>
        <Button variant="secondary" onClick={() => setStep("form")}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6">
      <div className="max-w-xl mx-auto">

        <Link
          href="/studio"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          Retour au studio
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Audio + Cover */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Audio <span className="text-red-400">*</span>
              </label>
              {audioFile ? (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 h-24">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                    <Music2 size={18} className="text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{audioFile.name}</p>
                    <p className="text-xs text-white/40">
                      {(audioFile.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <button type="button" onClick={() => setAudioFile(null)} className="text-white/30 hover:text-white/70 flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div
                  {...getAudioProps()}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed cursor-pointer transition-all",
                    isDragActive
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-white/10 hover:border-white/20 hover:bg-white/3"
                  )}
                >
                  <input {...getAudioInput()} />
                  <Upload size={22} className="text-white/25" />
                  <p className="text-xs text-white/40 text-center px-2">
                    MP3, WAV, FLAC<br />
                    <span className="text-white/20">max 50MB</span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Cover
              </label>
              {coverPreview ? (
                <div className="relative h-24 w-24 rounded-xl overflow-hidden">
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white"
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <div
                  {...getCoverProps()}
                  className="flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 cursor-pointer transition-all hover:bg-white/3"
                >
                  <input {...getCoverInput()} />
                  <ImageIcon size={22} className="text-white/25" />
                  <p className="text-xs text-white/40">JPG, PNG, WebP</p>
                </div>
              )}
            </div>
          </div>

          {/* Titre */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              placeholder="Titre du son"
              className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
            {autoSlug && (
              <p className="text-xs text-white/25 pl-1">
                ID : <span className="text-purple-400/60 font-mono">{autoSlug}</span>
              </p>
            )}
          </div>

          {/* Date de sortie */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={13} />
              Date de sortie
            </label>

            {/* Sélecteur de type */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              {([
                { value: "now",       label: "Maintenant" },
                { value: "past",      label: "Date passée" },
                { value: "scheduled", label: "Planifier" },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setReleaseType(value); setReleaseDate(""); }}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                    releaseType === value
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/60"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Champ date conditionnel */}
            {releaseType === "past" && (
              <div className="space-y-1">
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  max={today}
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
                />
                <p className="text-xs text-white/30 pl-1">
                  Le son sera catégorisé selon cette année de sortie
                </p>
              </div>
            )}

            {releaseType === "scheduled" && (
              <div className="space-y-1">
                <input
                  type="datetime-local"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  min={today}
                  className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
                />
                {releaseDate && new Date(releaseDate) > new Date() && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Calendar size={13} className="text-purple-400 flex-shrink-0" />
                    <p className="text-xs text-purple-300">
                      Sortie prévue le{" "}
                      {new Date(releaseDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" — "}le son ne sera pas visible jusqu'à cette date
                    </p>
                  </div>
                )}
              </div>
            )}

            {releaseType === "now" && (
              <p className="text-xs text-white/30 pl-1">
                Le son sera publié immédiatement
              </p>
            )}
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    genres.includes(g)
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/20"
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Paroles */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Paroles{" "}
              <span className="text-white/25 normal-case font-normal">(optionnel)</span>
            </label>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Colle les paroles ici..."
              rows={5}
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!audioFile || !title.trim()}
          >
            <Upload size={16} />
            {isScheduled() ? "Planifier la sortie" : "Publier le son"}
          </Button>

        </form>
      </div>
    </div>
  );
}