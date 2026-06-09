import { Metadata } from "next";
import PlaylistsClient from "./PlaylistsClient";

export const metadata: Metadata = { title: "Mes playlists" };

export default function PlaylistsPage() {
  return <PlaylistsClient />;
}