"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { trackToothFairyEvent } from "@/lib/toothfairy/browser-analytics"

function shortAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function WalletAnalytics() {
  const pathname = usePathname()
  const { publicKey, wallet } = useWallet()
  const lastTrackedWallet = useRef<string | null>(null)

  useEffect(() => {
    if (!publicKey) {
      lastTrackedWallet.current = null
      return
    }

    const walletAddress = publicKey.toBase58()
    if (lastTrackedWallet.current === walletAddress) return

    lastTrackedWallet.current = walletAddress
    trackToothFairyEvent("wallet_connected", {
      wallet: walletAddress,
      wallet_short: shortAddress(walletAddress),
      wallet_adapter: wallet?.adapter?.name || "unknown",
      path: pathname || "/toothfairy/app",
    })
  }, [pathname, publicKey, wallet?.adapter?.name])

  return null
}
