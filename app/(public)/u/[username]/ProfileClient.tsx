"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";

interface ProfileClientProps {
  profileUserId: string;
  initialImage?: string;
  initialCover?: string;
  name: string;
}

export function ProfileClient({
  profileUserId,
  initialImage,
  initialCover,
  name,
}: ProfileClientProps) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === profileUserId;

  const [image, setImage]               = useState(initialImage ?? "");
  const [coverImage, setCoverImage]     = useState(initialCover ?? "");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading,  setCoverUploading]  = useState(false);

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "moozik_unsigned");
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) throw new Error("Upload échoué");
    return (await res.json()).secure_url;
  }

  const onDropAvatar = useCallback(async (files: File[]) => {
    if (!files[0]) return;
    setAvatarUploading(true);
    try {
      const url = await uploadImage(files[0]);
      setImage(url);
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });
    } finally {
      setAvatarUploading(false);
    }
  }, []);

  const onDropCover = useCallback(async (files: File[]) => {
    if (!files[0]) return;
    setCoverUploading(true);
    try {
      const url = await uploadImage(files[0]);
      setCoverImage(url);
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverImage: url }),
      });
    } finally {
      setCoverUploading(false);
    }
  }, []);

  const { getRootProps: getAvatarProps, getInputProps: getAvatarInput } =
    useDropzone({
      onDrop: onDropAvatar,
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      maxFiles: 1,
      disabled: !isOwner,
    });

  const { getRootProps: getCoverProps, getInputProps: getCoverInput } =
    useDropzone({
      onDrop: onDropCover,
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
      maxFiles: 1,
      disabled: !isOwner,
    });

  return (
    <div className="relative mb-16 rounded-2xl overflow-hidden">
      {/* Cover */}
      <div
        {...(isOwner ? getCoverProps() : {})}
        className={`relative h-36 bg-gradient-to-br from-purple-900/60 to-black ${isOwner ? "cursor-pointer group" : ""}`}
      >
        {isOwner && <input {...getCoverInput()} />}
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {isOwner && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {coverUploading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Camera size={18} className="text-white" />
                <span className="text-sm text-white font-medium">
                  Changer la couverture
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div
        {...(isOwner ? getAvatarProps() : {})}
        className={`absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-[#0a0a0a] bg-purple-600/20 overflow-hidden ${isOwner ? "cursor-pointer group" : ""}`}
      >
        {isOwner && <input {...getAvatarInput()} />}
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-purple-400">
            {name[0]?.toUpperCase()}
          </div>
        )}
        {isOwner && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {avatarUploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Camera size={16} className="text-white" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}