import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'QeematCheck 🇵🇰 | Know the price. Compare. Speak up.',
  description: 'Public price verification platform for Karachi, Pakistan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="flex flex-col min-h-screen bg-[#0c1324] text-[#dce1fb] antialiased">
        <Navbar />
        <main className="flex-1 bg-[#0c1324]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}