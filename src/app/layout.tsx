import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Brand Intelligence Engine', template: '%s · Brand Intelligence Engine' },
  description: 'The single source of truth for brand knowledge, product information and e-commerce intelligence.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#111d18',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
