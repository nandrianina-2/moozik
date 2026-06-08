import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "Moozik",
    short_name:       "Moozik",
    description:      "Streaming musical indépendant",
    start_url:        "/dashboard",
    scope:            "/",
    display:          "standalone",
    background_color: "#0a0a0a",
    theme_color:      "#7c3aed",
    orientation:      "portrait-primary",
    icons: [
      {
        src:     "/icon-192.png",
        sizes:   "192x192",
        type:    "image/png",
        purpose: "any",
      },
      {
        src:     "/icon-512.png",
        sizes:   "512x512",
        type:    "image/png",
        purpose: "any",
      },
      {
        src:     "/icon-512.png",
        sizes:   "512x512",
        type:    "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["music", "entertainment"],
  };
}