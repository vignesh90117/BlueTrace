import type { Metadata } from 'next';
import './globals.css';
import { RoleProvider } from '@/components/RoleContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AquaCarbon MRV | Blockchain Blue Carbon Registry',
  description: 'A transparent, decentralized Blue Carbon Registry and automated Measurement, Reporting & Verification (MRV) platform for coastal mangrove and marine ecosystems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
        <RoleProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </RoleProvider>
      </body>
    </html>
  );
}
