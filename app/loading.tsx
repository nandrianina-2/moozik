export default function RootLoading() {
  return (
    <div className="min-h-dvh bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
        <p className="text-sm text-white/30">Chargement...</p>
      </div>
    </div>
  );
}