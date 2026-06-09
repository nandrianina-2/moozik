import { Metadata } from "next";
import FavoritesClient from "./FavoritesClient";

export const metadata: Metadata = { title: "Mes favoris" };

export default function FavoritesPage() {
  return <FavoritesClient />;
}