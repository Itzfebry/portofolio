import type { MetadataRoute } from "next";

import { getPortfolioData } from "@/lib/portfolio-data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getPortfolioData();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_URL}/images/Febry.png`],
    },
    {
      url: `${SITE_URL}/certificate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/project`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projects: MetadataRoute.Sitemap = data.projects
    .filter((project) => project.status === "published")
    .map((project) => ({
      url: `${SITE_URL}/project/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...projects];
}
