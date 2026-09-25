import type { MetadataRoute } from "next";
import { functions, tools } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteConfig.url}/architecture`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/stack-builder`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/governance`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const functionRoutes: MetadataRoute.Sitemap = functions.map((fn) => ({
    url: `${siteConfig.url}/functions/${fn.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
    lastModified: tool.lastChecked,
  }));

  return [...staticRoutes, ...functionRoutes, ...toolRoutes];
}
