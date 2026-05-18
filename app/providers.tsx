'use client'

/**
 * Providers wrapper
 * Wraps the app with Wagmi, RainbowKit, React Query, and Toast providers
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { Toaster } from 'react-hot-toast'
import { wagmiConfig } from '@/lib/wagmi'
import { useState } from 'react'

// RainbowKit CSS must be imported in _app or a client component
import '@rainbow-me/rainbowkit/styles.css'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // Create QueryClient once per component lifecycle (prevents SSR issues)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 min
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#00D4FF',
            accentColorForeground: '#0A0B0F',
            borderRadius: 'large',
            fontStack: 'system',
            overlayBlur: 'large',
          })}
          coolMode
        >
          {children}

          {/* Global toast notifications */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#0F1117',
                color: '#E5E7EB',
                border: '1px solid #1E2130',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#00D4FF', secondary: '#0A0B0F' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#0A0B0F' },
              },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
