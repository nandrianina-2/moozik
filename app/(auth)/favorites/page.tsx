import { Header } from "@/components/layout/Header";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  return (
    <div className="pb-32">
      <Header title="Favoris" />
      <div className="px-4 md:px-6 py-6">
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <Heart size={28} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm">
            Tes sons likés apparaîtront ici
          </p>
        </div>
      </div>
    </div>
  );
}