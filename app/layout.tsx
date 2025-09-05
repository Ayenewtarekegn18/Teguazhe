import type React from "react";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { ClientBody } from "@/components/layout/client-body";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tequazhe Transport Management System",
  description: "Book, manage, and track your bus journeys with ease",
  generator: "Teguazhe-transportation-system.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={urbanist.variable}>
      <ClientBody className={urbanist.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </ClientBody>
    </html>
  );
}
