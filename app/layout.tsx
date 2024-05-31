import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "react-pico8-chaos",
  description: "What on earth is going on here",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={'dark ' + inter.className} style={{colorScheme: 'dark'}}>{children}</body>
    </html>
  );
}
