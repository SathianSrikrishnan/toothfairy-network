import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/toothfairy/nav/theme-context'
import { ThemeTransition } from '@/components/toothfairy/nav/theme-transition'
import { TFNHeader } from '@/components/toothfairy/nav/tfn-header'
import { TFNFooter } from '@/components/toothfairy/nav/tfn-footer'
import { TFNSiteReporter } from '@/components/toothfairy/reporting/tfn-site-reporter'

// TFN routes use the local fallback font variables from globals.css.
const shareTagline = "A child's first digital asset from a lost tooth."

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F0C456',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://toothfairy.network'),
  alternates: { canonical: '/' },
  applicationName: 'Tooth Fairy Network',
  title: 'Tooth Fairy Network',
  description: shareTagline,
  manifest: '/manifest.json',
  icons: {
    icon: '/toothfairy/brand/toothfairy-glow-mark-512.png',
    apple: '/toothfairy/brand/toothfairy-glow-mark-512.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tooth Fairy Network',
  },
  openGraph: {
    title: 'Tooth Fairy Network',
    description: shareTagline,
    url: '/',
    siteName: 'Tooth Fairy Network',
    type: 'website',
    images: [
      {
        url: '/toothfairy/opengraph-image',
        width: 1200,
        height: 630,
        alt: `Tooth Fairy Network - ${shareTagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tooth Fairy Network',
    description: shareTagline,
    images: ['/toothfairy/opengraph-image'],
  },
}

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <ThemeProvider defaultMode="parent">
        <ThemeTransition>
          <TFNSiteReporter />
          <TFNHeader />
          {children}
          <TFNFooter />
        </ThemeTransition>
      </ThemeProvider>
    </div>
  )
}
