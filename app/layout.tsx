import type { Metadata } from "next";
import { Atkinson_Hyperlegible, JetBrains_Mono, Nunito } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StudentSU Examprep",
    template: "%s · StudentSU Examprep",
  },
  description:
    "Latihan soal UTS dan UAS dari materi kuliahmu sendiri. Berjalan lokal, memakai API key milikmu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${atkinson.variable} ${nunito.variable} ${jetbrains.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
