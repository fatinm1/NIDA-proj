import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI NDA Redlining — Tracked Changes in Minutes',
  description: 'Upload NDAs, apply standard rules, and download a Word file with tracked changes. Deterministic edits + AI assist. Private by default.',
  openGraph: {
    title: 'AI NDA Redlining — Tracked Changes in Minutes',
    description: 'Upload NDAs, apply standard rules, and download a Word file with tracked changes. Deterministic edits + AI assist. Private by default.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
