import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow:     ["/", "/artists/", "/albums/", "/u/", "/playlists/"],
        disallow:  ["/admin/", "/api/", "/studio/", "/account", "/settings"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}