// "use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./global.css";
// import { ThemeProvider } from 'next-themes'
import "@radix-ui/themes/styles.css";
// import { Theme } from "@radix-ui/themes";
import SessionWrapper from "./_components/sessionWrapper";
import { Providers } from "./providers"
import { Theme } from "@radix-ui/themes";
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
    <html lang="en" suppressHydrationWarning>
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Theme>

            <SessionWrapper>
              {children}
            </SessionWrapper>
          </Theme>
        </Providers>
      </body>
    </html>
  );
}
