import './globals.css';
import type { Metadata } from 'next';
import AuthInitializer from '@/components/auth/AuthInitializer';
import { ReactNode } from 'react';

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
    images: ['https://pathpr.ca/logo/canada-logo-light.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1.0,
  },
  other: {
    'apple-mobile-web-app-title': 'PathPR',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VPMTLW1LT8"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VPMTLW1LT8');
            `,
          }}
        />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Inline styles for hero button */}
        <style>
          {`
            #hero-button {
              background-color: white;
              color: #035ca9;
              border: 1px solid #035ca9;
            }
            #hero-button:hover {
              background-color: #035ca9;
              color: white;
              border: 1px solid white;
            }
          `}
        </style>
      </head>
      <body>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
