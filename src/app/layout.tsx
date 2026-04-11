import type { Metadata } from "next";
import { Cairo, Arimo } from "next/font/google";

import "./globals.css";

import { cn } from "@/src/shared/lib/utils";

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "Akalat",
    template: "%s | Akalat",
  },
  description:
    "AI-powered cooking experience with multilingual authentication and onboarding.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={cn("font-sans antialiased", arimo.variable, cairo.variable)}
    >
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
