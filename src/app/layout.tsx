import './globals.css';
import type { Metadata } from 'next';
import AuthInitializer from '@/components/auth/AuthInitializer';
export const metadata: Metadata = {
  title: 'Pathpr — AI powered immigration guidance',
  description: 'Discover personalized immigration pathways to Canada using AI-powered tools. Get started with a free eligibility check today.',
  openGraph: {
    title: 'Pathpr — AI powered immigration guidance',
    description: 'Get free, personalized immigration support to Canada. Fast, AI-driven, and trusted.',
    url: 'https://pathpr.ca',
    images: [
      {
        url: 'https://pathpr.ca/assets/canada-logo-light.png',
        width: 1200,
        height: 630,
        alt: 'Pathpr Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pathpr',
    creator: '@pathpr',
    title: 'Pathpr — AI powered immigration guidance',
    description: 'Get free, personalized immigration support to Canada. Fast, AI-driven, and trusted.',
    images: ['https://pathpr.ca/assets/canada-logo-light.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
