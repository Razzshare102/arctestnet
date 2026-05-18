import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'ShareSwap — ARC Testnet DeFi',
  description:
    'Trade stablecoins, mint NFTs, and explore the ARC ecosystem. Built by RazzShares.',
  keywords: ['ARC', 'DeFi', 'swap', 'NFT', 'testnet', 'Web3', 'USDC'],
  authors: [{ name: 'RazzShares', url: 'https://x.com/Razzshares' }],
  openGraph: {
    title: 'ShareSwap — ARC Testnet DeFi',
    description: 'Trade stablecoins, mint NFTs, and explore the ARC ecosystem.',
    url: 'https://shareswap.vercel.app',
    siteName: 'ShareSwap',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShareSwap — ARC Testnet DeFi',
    description: 'Trade stablecoins, mint NFTs, and explore the ARC ecosystem.',
    creator: '@Razzshares',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-arc-darker text-white antialiased">
        <Providers>
          {/* Animated background */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-arc-blue/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-arc-purple/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-arc-pink/3 rounded-full blur-3xl" />
          </div>

          {/* Layout shell */}
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar — hidden on mobile */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
