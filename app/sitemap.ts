import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Artist from "@/models/Artist";
import Song from "@/models/Song";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  await connectDB();

  const [artists, songs] = await Promise.all([
    Artist.find().select("_id updatedAt").lean(),
    Song.find({ isPublished: true }).select("_id updatedAt").lean(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl,           lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
    { url: `${baseUrl}/login`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  const artistRoutes: MetadataRoute.Sitemap = artists.map((a) => ({
    url:              `${baseUrl}/artists/${(a._id as any).toString()}`,
    lastModified:     new Date(a.updatedAt),
    changeFrequency:  "weekly",
    priority:         0.8,
  }));

  return [...staticRoutes, ...artistRoutes];
}