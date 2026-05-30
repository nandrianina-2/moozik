export type Role = "user" | "artist" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: Role;
  isPremium: boolean;
  createdAt: Date;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  coverImage?: string;
  isVerified: boolean;
  userId: string;
  followers: number;
  genres: string[];
}

export interface Song {
  id: string;
  title: string;
  slug: string;
  audioUrl: string;
  coverUrl?: string;
  duration: number;
  artist: Artist;
  albumId?: string;
  genres: string[];
  streamCount: number;
  likesCount: number;
  isLiked?: boolean;
  lyrics?: string;
  releaseDate: Date;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string;
  artist: Artist;
  songs: Song[];
  releaseDate: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  songs: Song[];
  userId: string;
  isPublic: boolean;
  createdAt: Date;
}

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";
export type RepeatMode = "off" | "one" | "all";