import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const viewport = {
  themeColor: '#4263eb',
}

export const metadata = {
  title: 'BioFlow | Your Digital Presence',
  description: 'Mark your digital presence with ease. A clean and minimal bio link site.',
  icons: {
    icon: [
      { url: '/images/BioFlow-LogoBG.png', sizes: '32x32' },
    ],
    apple: [
      { url: '/images/BioFlow-LogoBG.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/images/BioFlow-LogoBG.png" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}>
        <main className="flex-grow">
          {children}
        </main>
        <div id="portal-root"></div>
      </body>
    </html>
  )
}
