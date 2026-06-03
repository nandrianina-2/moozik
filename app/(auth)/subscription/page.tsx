import { Suspense } from "react";
import SubscriptionContent from "./SubscriptionContent";

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full text-white/40 text-sm">
        Chargement...
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}