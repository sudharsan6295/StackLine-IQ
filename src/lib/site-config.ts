export const siteConfig = {
  name: "AI Tools Hub",
  shortName: "AI Tools Hub",
  tagline: "The enterprise registry for AI tools",
  description:
    "Find the best-in-category AI tool for every business function and every stage of the product lifecycle — with sourced pricing, free-tier details, and an adoption roadmap for each one.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-tools-hub.example.com",
};

export const navLinks = [
  { href: "/", label: "Registry" },
  { href: "/stack-builder", label: "Stack Builder" },
  { href: "/governance", label: "Governance" },
];
