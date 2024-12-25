import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Easy Scrape",
  description: "Scrape whatever you want",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-primary hover:bg-primary/80 text-sm !shadow-none",
            },
          }}
          afterSignOutUrl={"/sign-in"}
        >
          <AppProviders>
            {children}
            <Toaster richColors/>
          </AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
