export const siteConfig = {
  name: "StacklineIQ",
  shortName: "StacklineIQ",
  tagline: "Verified costs, smarter choices.",
  description:
    "Find the best-in-category AI tool for every business function and every stage of the product lifecycle — with sourced pricing, free-tier details, and an adoption roadmap for each one.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://stackline.example.com",
};

export const navLinks = [
  { href: "/architecture", label: "Explore" },
  { href: "/", label: "Registry" },
  { href: "/stack-builder", label: "Build" },
  { href: "/governance", label: "Governance" },
];
