import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'MyBJJStory',
  description: 'Din personlige BJJ-reise',
  applicationName: 'MyBJJStory',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MyBJJStory',
  },
  icons: {
    apple: '/icons/icon-192.png',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#0d0d1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
