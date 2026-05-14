"use client"

import { Buffer } from "buffer"
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer
}

import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"

import { ViewModeProvider } from "@/components/toothfairy/view-mode-context"
import { WalletAnalytics } from "@/components/toothfairy/app/wallet-analytics"
import "@solana/wallet-adapter-react-ui/styles.css"

// ThemedWrapper now reads straight from the CSS vars published by the
// /toothfairy root's ThemeTransition. No local theming — Impeccable wins.
function ThemedWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen antialiased"
      style={{
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
        background: "var(--tfn-surface)",
        color: "var(--tfn-ink)",
      }}
    >
      {children}
    </div>
  )
}

const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"

export default function ToothFairyAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  const CP = ConnectionProvider as React.ComponentType<{ endpoint: string; children: React.ReactNode }>
  const WP = WalletProvider as React.ComponentType<{ wallets: ReturnType<typeof useMemo>; autoConnect?: boolean; children: React.ReactNode }>
  const WMP = WalletModalProvider as React.ComponentType<{ children: React.ReactNode }>

  return (
    <CP endpoint={RPC_ENDPOINT}>
      <WP wallets={wallets} autoConnect>
        <WMP>
          <ViewModeProvider>
            <WalletAnalytics />
            <ThemedWrapper>{children}</ThemedWrapper>
          </ViewModeProvider>
        </WMP>
      </WP>
    </CP>
  )
}
