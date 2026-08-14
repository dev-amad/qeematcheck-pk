import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'QeematCheck 🇵🇰 | Know the price. Compare. Speak up.',
  description:
    'Public price verification and community reporting platform for Karachi, Pakistan. Benchmark consumer prices against official Commissioner Karachi notifications.',
  keywords: [
    'QeematCheck',
    'Karachi Price Check',
    'Karachi Grocery Prices',
    'Commissioner Karachi Price List',
    'Public Price Verification',
    'Civic Tech Pakistan',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
