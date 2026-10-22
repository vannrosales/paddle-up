import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { CommandPalette } from "@/components/command-palette";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Pickleball Players Profiling, Achievements, and Role",
    default: "PaddleUp | Pickleball Players Profiling, Achievements, and Role",
  },
  description:
    "A free web app where pickleball players create a profile, declare their playing role, log achievements, and get discovered.",
  applicationName: "PaddleUp",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/brand/mark.svg",
  },
  openGraph: {
    title: "PaddleUp | Pickleball Players Profiling, Achievements, and Role",
    description:
      "Your pickleball profile, achievements, and playing role in one place.",
    siteName: "PaddleUp",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PaddleUp | Pickleball Players Profiling, Achievements, and Role",
    description:
      "Your pickleball profile, achievements, and playing role in one place.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2F2F7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${inter.className}`}>
      <body className="min-h-screen flex flex-col bg-[#F2F2F7] dark:bg-black text-[#1C1C1E] dark:text-[#F2F2F7] antialiased pb-20 md:pb-6">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <MobileTabBar />
          <CommandPalette />
          <PwaInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
