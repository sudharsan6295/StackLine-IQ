import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CommandPalette } from "@/components/command-palette";
import { Analytics } from "@/components/analytics";
import { TooltipProvider } from "@/components/ui/tooltip";
import { siteConfig } from "@/lib/site-config";
import { stats } from "@/lib/data";

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const data = JetBrains_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    applicationCategory: "BusinessApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    about: `A directory of ${stats.toolCount} AI tools across ${stats.functionCount} enterprise business functions.`,
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${data.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-dot-grid">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={150}>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <SiteHeader />
            <CommandPalette />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <Script
          id="app-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
