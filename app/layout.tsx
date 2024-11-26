// "use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./global.css";
import { ThemeProvider } from 'next-themes'
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import SessionWrapper from "./_components/sessionWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nebula",
  description: "desc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>

          <Theme>
            {children}
          </Theme>
        </SessionWrapper>
      </body>
    </html>
  );
}
