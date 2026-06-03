import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export const PLANS = {
  premium: {
    name:       "Premium",
    priceId:    process.env.STRIPE_PREMIUM_PRICE_ID!,
    price:      4.99,
    currency:   "eur",
    features:   [
      "Qualité audio haute définition",
      "Téléchargement offline illimité",
      "Sans publicité",
      "Accès anticipé aux nouvelles sorties",
    ],
  },
  artist: {
    name:       "Artist Pro",
    priceId:    process.env.STRIPE_ARTIST_PRICE_ID!,
    price:      9.99,
    currency:   "eur",
    features:   [
      "Tout Premium inclus",
      "Upload illimité",
      "Analytics avancées",
      "Badge artiste vérifié",
      "Revenus directs des streams",
    ],
  },
} as const;