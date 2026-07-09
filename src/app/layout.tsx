import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SoundProvider } from "@/lib/sound";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Liftoff — Gamified Workout Tracker",
  description: "Track workouts, earn XP, compete with friends. The fitness app that feels like a game.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Liftoff",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased overflow-hidden">
        <ThemeProvider>
          <SoundProvider>{children}</SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}