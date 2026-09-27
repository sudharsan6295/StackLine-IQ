import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "An interactive map of the whole AI-augmented product lifecycle — every business function, its subtypes, how functions connect to each other, and the top-pick AI tool for every stage.",
};

export default function ArchitectureLayout({
  children,
}: LayoutProps<"/architecture">) {
  return children;
}
