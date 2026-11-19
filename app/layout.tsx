import React from "react"
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { APP_TITLE } from '@/lib/branding'
import './globals.css'

const geistSans = localFont({
  src: './fonts/Geist.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMono.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: APP_TITLE,
  description: 'Generate editable 3D parametric designs from natural language',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
