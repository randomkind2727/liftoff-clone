import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liftoff — Gamified Workout Tracker",
  description: "Track your workouts, earn XP, and level up your fitness journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
