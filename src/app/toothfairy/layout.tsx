import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/toothfairy/nav/theme-context'
import { ThemeTransition } from '@/components/toothfairy/nav/theme-transition'
import { TFNHeader } from '@/components/toothfairy/nav/tfn-header'
import { TFNFooter } from '@/components/toothfairy/nav/tfn-footer'

const siteDescription =
  "Turn a child's lost tooth into a Toothlight memory, bedtime story, and parent-controlled Smile Fund preview."
const siteImage = '/toothfairy/opengraph-image'

// TFN routes use the local fallback font variables from globals.css.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F0C456',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://toothfairy.network'),
  title: 'Tooth Fairy Network',
  description: siteDescription,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tooth Fairy Network',
  },
  openGraph: {
    title: 'Tooth Fairy Network',
    description: siteDescription,
    url: '/',
    siteName: 'Tooth Fairy Network',
    type: 'website',
    images: [
      {
        url: siteImage,
        width: 1200,
        height: 630,
        alt: 'The Tooth Fairy Network',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tooth Fairy Network',
    description: siteDescription,
    images: [siteImage],
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
          <TFNHeader />
          {children}
          <TFNFooter />
        </ThemeTransition>
      </ThemeProvider>
    </div>
  )
}
