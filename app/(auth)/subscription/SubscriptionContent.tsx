"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  Crown, Check, Zap, Music2,
  ArrowRight, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id:       "free",
    name:     "Gratuit",
    price:    "0€",
    period:   "",
    features: [
      "Écoute illimitée",
      "Qualité audio standard",
      "Playlists personnalisées",
      "Commentaires et likes",
    ],
    missing: [
      "Qualité haute définition",
      "Téléchargement offline",
    ],
    color:  "border-white/10",
    button: null,
  },
  {
    id:       "premium",
    name:     "Premium",
    price:    "4,99€",
    period:   "/ mois",
    features: [
      "Tout du plan Gratuit",
      "Qualité audio haute définition",
      "Téléchargement offline illimité",
      "Sans publicité",
      "Accès anticipé aux sorties",
    ],
    missing:  [],
    color:    "border-purple-500/50 bg-purple-500/5",
    button:   "premium",
    popular:  true,
  },
  {
    id:       "artist",
    name:     "Artist Pro",
    price:    "9,99€",
    period:   "/ mois",
    features: [
      "Tout du plan Premium",
      "Upload illimité",
      "Analytics avancées",
      "Badge artiste vérifié",
      "Revenus directs des streams",
    ],
    missing:  [],
    color:    "border-pink-500/30 bg-pink-500/5",
    button:   "artist",
  },
];

export default function SubscriptionContent() {
  const { user, isPremium } = useCurrentUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const success  = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (success) {
      router.replace("/subscription");
    }
  }, [success, router]);

  async function handleSubscribe(plan: string) {
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ plan }),
    });
    const data = await res.json();
    setLoading(null);
    if (data.url) window.location.href = data.url;
  }

  async function handlePortal() {
    setPortalLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    setPortalLoading(false);
    if (data.url) window.location.href = data.url;
  }

  return (
    <div className="pb-32">
      <Header title="Abonnement" />

      <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto">

        {/* Success / canceled */}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
            <Check size={18} className="text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-400">
                Abonnement activé !
              </p>
              <p className="text-xs text-green-400/70">
                Bienvenue dans Moozik Premium.
              </p>
            </div>
          </div>
        )}

        {canceled && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-6">
            <p className="text-sm text-orange-400">
              Paiement annulé — aucun montant débité.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">
            Choisis ton plan
          </h1>
          <p className="text-white/50 text-sm">
            Passe à Premium pour une expérience sans limites
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col p-5 rounded-2xl border transition-all",
                plan.color,
                isPremium && plan.id === "premium"
                  ? "ring-2 ring-purple-500"
                  : ""
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-purple-600 text-xs font-semibold text-white">
                    Populaire
                  </span>
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {plan.id === "free"    && <Music2 size={16} className="text-white/40" />}
                  {plan.id === "premium" && <Crown  size={16} className="text-yellow-400" />}
                  {plan.id === "artist"  && <Zap    size={16} className="text-pink-400" />}
                  <span className="text-sm font-semibold text-white">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-white/40">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/25 line-through">
                    <Check size={14} className="text-white/20 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.button ? (
                isPremium && plan.id === "premium" ? (
                  <div className="flex items-center gap-2 justify-center py-2 text-sm text-purple-400 font-medium">
                    <Check size={16} />
                    Plan actuel
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full"
                    loading={loading === plan.button}
                    onClick={() => handleSubscribe(plan.button!)}
                  >
                    Choisir {plan.name}
                    <ArrowRight size={15} />
                  </Button>
                )
              ) : (
                <div className="py-2 text-center text-sm text-white/40">
                  {isPremium ? "" : "Plan actuel"}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Gérer abonnement */}
        {isPremium && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <p className="text-sm font-semibold text-white">Gérer mon abonnement</p>
              <p className="text-xs text-white/40">Modifier, annuler ou voir les factures</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              loading={portalLoading}
              onClick={handlePortal}
            >
              <ExternalLink size={14} />
              Portail Stripe
            </Button>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-10 space-y-3">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
            Questions fréquentes
          </h2>
          {[
            {
              q: "Puis-je annuler à tout moment ?",
              a: "Oui, tu peux annuler depuis le portail Stripe. L'accès Premium reste actif jusqu'à la fin de la période payée.",
            },
            {
              q: "Le paiement est-il sécurisé ?",
              a: "Oui, les paiements sont gérés par Stripe, leader mondial du paiement en ligne. Aucune donnée bancaire n'est stockée sur nos serveurs.",
            },
            {
              q: "Quelle est la différence entre Premium et Artist Pro ?",
              a: "Premium est pour les auditeurs. Artist Pro inclut tout Premium plus les outils de création : upload illimité, analytics et monétisation.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="p-4 rounded-xl bg-white/3 border border-white/5">
              <p className="text-sm font-medium text-white mb-1">{q}</p>
              <p className="text-xs text-white/50 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}