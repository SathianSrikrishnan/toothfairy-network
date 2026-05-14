import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ChatWidget } from '@/components/ChatWidget'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://sathian.ai'),
  alternates: { canonical: './' },
  title: 'sathian.ai',
  description: 'Personal site of Sathian. Experiments, projects, and writings.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'sathian.ai',
    description: 'Personal site of Sathian. Experiments, projects, and writings.',
    siteName: 'sathian.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'sathian.ai',
    description: 'Personal site of Sathian. Experiments, projects, and writings.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const host = headers().get('host') ?? ''
  const isTfnDomain =
    host === 'toothfairy.network' ||
    host === 'www.toothfairy.network' ||
    host === 'toothfairy.sathian.ai'

  return (
    <html lang="en" data-theme="dark">
      <body className="font-sans antialiased">
        {children}
        {!isTfnDomain && <ChatWidget />}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
