import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build",
  description:
    "Pick your functions, team size, and budget level to get a recommended AI tool stack with an estimated monthly cost.",
};

export default function StackBuilderLayout({
  children,
}: LayoutProps<"/stack-builder">) {
  return children;
}
