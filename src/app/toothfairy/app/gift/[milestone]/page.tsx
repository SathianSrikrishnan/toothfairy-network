"use client"

import { useState, useMemo, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { AnchorProvider } from "@coral-xyz/anchor"
import { PublicKey } from "@solana/web3.js"
import { useParams } from "next/navigation"
import {
  getEscrowProgram,
  deposit as escrowDeposit,
  fetchDepositsForMilestone,
  calculateFee,
  type LockPeriodKey,
  type DepositData,
} from "@/lib/toothfairy/escrow"
import { WalletButton } from "@/components/toothfairy/app/wallet-button"
import { C } from "@/components/toothfairy/tokens"
import type { KeepsakeData } from "@/lib/toothfairy/keepsake-data"
import { trackToothFairyEvent } from "@/lib/toothfairy/browser-analytics"
import Link from "next/link"

const page = {
  cream: "oklch(97.5% 0.01 80)",
  creamDeep: "oklch(95% 0.015 75)",
  paper: "oklch(100% 0 0 / 0.72)",
  ink: "#11234a",
  inkSoft: "#334260",
  muted: "#6b7280",
  gold: "oklch(72% 0.145 75)",
  goldSoft: "oklch(72% 0.145 75 / 0.12)",
  purple: "#6d45a8",
  purpleSoft: "rgba(109, 69, 168, 0.10)",
  teal: "#178f7b",
  tealSoft: "rgba(23, 143, 123, 0.10)",
  border: "oklch(88% 0.015 75)",
}

const amountPresets = [
  { label: "0.05 SOL", amount: "0.05" },
  { label: "0.10 SOL", amount: "0.1" },
  { label: "0.25 SOL", amount: "0.25" },
  { label: "0.50 SOL", amount: "0.5" },
]

export default function GiftPage() {
  const params = useParams()
  const milestonePda = params.milestone as string

  const {
    publicKey,
    signTransaction,
    signAllTransactions,
    connect,
    connecting,
    wallet,
  } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()

  const [depositorName, setDepositorName] = useState("")
  const [depositAmount, setDepositAmount] = useState("0.1")
  const [lockChoice, setLockChoice] = useState<"now" | "ageTen">("ageTen")
  const [loading, setLoading] = useState(false)
  const [deposits, setDeposits] = useState<DepositData[]>([])
  const [milestoneData, setMilestoneData] = useState<any>(null)
  const [childProfileData, setChildProfileData] = useState<any>(null)
  const [childProfilePda, setChildProfilePda] = useState<string | null>(null)
  const [keepsakeData, setKeepsakeData] = useState<KeepsakeData | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [walletConnectError, setWalletConnectError] = useState<string | null>(null)
  const [connectIntent, setConnectIntent] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  const anchorProvider = useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) return null
    return new AnchorProvider(connection, { publicKey, signTransaction, signAllTransactions } as any, { commitment: "confirmed" })
  }, [publicKey, signTransaction, signAllTransactions, connection])

  // Load milestone data + deposits
  useEffect(() => {
    if (!anchorProvider || !milestonePda) return
    const load = async () => {
      try {
        const program = getEscrowProgram(anchorProvider)
        const milestone = await program.account.milestone.fetch(new PublicKey(milestonePda))
        setMilestoneData(milestone)
        setChildProfilePda(milestone.childProfile.toBase58())

        // Fetch child profile for name and DOB
        try {
          const profile = await program.account.childProfile.fetch(milestone.childProfile)
          setChildProfileData(profile)
        } catch {}

        const deps = await fetchDepositsForMilestone(program, new PublicKey(milestonePda))
        setDeposits(deps)
      } catch (err: any) {
        setError("Could not find this milestone. The link may be invalid.")
      } finally {
        setPageLoading(false)
      }
    }
    load()
  }, [anchorProvider, milestonePda])

  useEffect(() => {
    let cancelled = false
    if (!milestonePda) return

    fetch(`/api/toothfairy/keepsake/${milestonePda}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: KeepsakeData | null) => {
        if (!cancelled && data) setKeepsakeData(data)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [milestonePda])

  // Also try loading without wallet (just to show info)
  useEffect(() => {
    if (anchorProvider) return // already loading with wallet
    setPageLoading(false)
  }, [anchorProvider])

  const handleDeposit = async () => {
    if (!publicKey || !anchorProvider || !childProfilePda) return
    setError(null); setLoading(true); setSuccess(null)

    try {
      const program = getEscrowProgram(anchorProvider)
      const amount = parseFloat(depositAmount)
      if (isNaN(amount) || amount <= 0) throw new Error("Enter a valid amount")
      if (!depositorName.trim()) throw new Error("Enter your name")

      // Calculate lock
      let lockPeriodKey: LockPeriodKey = "immediate"
      let lockTimestamp: number | undefined
      if (lockChoice === "ageTen") {
        // Get DOB from localStorage or profile name
        const childName = childProfileData?.childName || ""
        const dobStr = typeof window !== "undefined" ? localStorage.getItem(`tfn-child-dob-${childName}`) || localStorage.getItem(`tfn-child-dob-${childName.toLowerCase().trim()}`) : null
        if (dobStr) {
          const dob = new Date(dobStr + "T00:00:00")
          const unlockDate = new Date(dob)
          unlockDate.setFullYear(unlockDate.getFullYear() + 10)
          lockTimestamp = Math.floor(unlockDate.getTime() / 1000)
          lockPeriodKey = "untilTimestamp"
        } else {
          // Fallback: 10 years from now
          lockTimestamp = Math.floor(Date.now() / 1000) + (10 * 365.25 * 24 * 60 * 60)
          lockPeriodKey = "untilTimestamp"
        }
      }

      const txSignature = await escrowDeposit(program, publicKey, new PublicKey(childProfilePda), new PublicKey(milestonePda), amount, lockPeriodKey, depositorName.trim(), lockTimestamp)
      trackToothFairyEvent("gift_deposit_success", {
        tx_signature: txSignature,
        milestone_pda: milestonePda,
        child_profile_pda: childProfilePda,
        deposit_amount_sol: amount,
        lock_period: lockPeriodKey,
        wallet: publicKey.toBase58(),
        path: window.location.pathname,
      })

      void fetch("/api/toothfairy/gift-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txSignature,
          milestonePda,
          depositorPubkey: publicKey.toBase58(),
        }),
      }).catch((receiptError) => {
        console.warn("[gift] parent receipt dispatch failed:", receiptError)
      })

      const deps = await fetchDepositsForMilestone(program, new PublicKey(milestonePda))
      setDeposits(deps)
      setSuccess(`${depositAmount} SOL deposited!`)

      setDepositAmount("0.1"); setDepositorName("")
    } catch (err: any) {
      setError(err.message || "Deposit failed")
    } finally { setLoading(false) }
  }

  const displayChildName = childProfileData?.childName || keepsakeData?.childName || "this child"
  const liveDeposits = deposits.length > 0
    ? deposits
    : (keepsakeData?.deposits || []).map((deposit) => ({
        depositorName: deposit.name,
        amountSol: deposit.amount,
        claimed: false,
        lockLabel: deposit.locked ? "locked" : "available",
      } as DepositData))
  const totalEscrowed =
    deposits.length > 0
      ? deposits.reduce((s, d) => s + (d.claimed ? 0 : d.amountSol), 0)
      : keepsakeData?.totalEscrowed || 0
  const giftVerb = lockChoice === "ageTen" ? "Save" : "Gift"

  useEffect(() => {
    if (!connectIntent || !wallet || publicKey || connecting) return

    let cancelled = false

    const finishConnection = async () => {
      try {
        await connect()
        if (!cancelled) setWalletConnectError(null)
      } catch {
        if (!cancelled) {
          setWalletConnectError(
            "Phantom did not finish connecting. Unlock Phantom, approve toothfairy.network, then try again."
          )
          setVisible(true)
        }
      } finally {
        if (!cancelled) setConnectIntent(false)
      }
    }

    finishConnection()

    return () => {
      cancelled = true
    }
  }, [connectIntent, wallet, publicKey, connecting, connect, setVisible])

  const requestWalletConnection = () => {
    setError(null)

    if (publicKey || connecting) return

    setConnectIntent(true)

    if (!wallet) {
      setVisible(true)
      setWalletConnectError("Choose Phantom from the wallet window, then approve the connection.")
      return
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          `radial-gradient(circle at 86% 0%, rgba(216,164,60,0.18), transparent 18rem), radial-gradient(circle at 10% 0%, rgba(109,69,168,0.11), transparent 16rem), linear-gradient(180deg, ${page.creamDeep}, ${page.cream})`,
        color: page.ink,
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
      }}
    >
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <header className="mb-8 flex items-center justify-between gap-4">
        <Link href="/toothfairy" className="flex items-center gap-3 no-underline">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: "rgba(109, 69, 168, 0.08)",
              color: page.purple,
              border: `1px solid ${page.border}`,
            }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
              <path d="M8 3c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.1 4.1.6 1.6 1.1 3.2 1.2 5 .1 1.5.7 3.9 2 3.9 1 0 1.4-1.4 1.8-3.1.4-1.6.8-3.1 1.9-3.1s1.5 1.5 1.9 3.1c.4 1.7.8 3.1 1.8 3.1 1.3 0 1.9-2.4 2-3.9.1-1.8.6-3.4 1.2-5 .5-1.3 1.1-2.7 1.1-4.1 0-2.2-1.8-4-4-4-1.3 0-2.4.5-3.2 1.2-.5.4-1.1.4-1.6 0C10.4 3.5 9.3 3 8 3Z" />
            </svg>
          </span>
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display), 'Alegreya', Georgia, serif", color: page.ink }}
            >
              Tooth Fairy Network
            </h1>
            <p className="text-xs" style={{ color: page.muted }}>Smile Fund family link</p>
          </div>
        </Link>
        <WalletButton />
      </header>

      {error && (
        <div className="mb-6 rounded-lg p-3 text-sm" style={{ background: "rgba(244, 63, 94, 0.1)", color: C.rose }}>
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline text-xs">dismiss</button>
        </div>
      )}

      {pageLoading && (
        <div className="text-center py-20">
          <p className="text-sm animate-pulse" style={{ color: C.muted }}>Loading...</p>
        </div>
      )}

      {!pageLoading && (
        <div className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
          <div
            className="overflow-hidden rounded-lg px-6 py-7 md:px-8"
            style={{
              background:
                "radial-gradient(circle at 90% 10%, rgba(216,164,60,0.18), transparent 13rem), radial-gradient(circle at 12% 0%, rgba(109,69,168,0.10), transparent 14rem), oklch(100% 0 0 / 0.70)",
              border: `1px solid ${page.border}`,
              boxShadow: "0 18px 44px oklch(30% 0.035 65 / 0.08)",
            }}
          >
            <p
              className="text-xs font-black uppercase"
              style={{ color: page.gold, letterSpacing: "0.18em", fontWeight: 800 }}
            >
              Family gift link
            </p>
            <h2
              className="mt-3 text-4xl leading-tight md:text-5xl"
              style={{
                color: page.ink,
                fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
                fontWeight: 700,
              }}
            >
              {displayChildName}&apos;s memory is ready to share.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: page.inkSoft }}>
              Open the keepsake first. A small gift can come later, and the
              parent keeps control until the child is ready to learn from it.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-[0.88fr_1.12fr] sm:items-stretch">
              <div
                className="flex min-h-48 items-center justify-center overflow-hidden rounded-lg"
                style={{ background: page.cream, border: `1px solid ${page.border}` }}
              >
                {keepsakeData?.drawingUrl || keepsakeData?.smilePhotoUrl ? (
                  <img
                    src={keepsakeData.drawingUrl || keepsakeData.smilePhotoUrl || ""}
                    alt={`${displayChildName}'s tooth memory`}
                    className="h-full max-h-64 w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "rgba(216,164,60,0.14)", color: page.gold }}>
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M8 3c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.1 4.1.6 1.6 1.1 3.2 1.2 5 .1 1.5.7 3.9 2 3.9 1 0 1.4-1.4 1.8-3.1.4-1.6.8-3.1 1.9-3.1s1.5 1.5 1.9 3.1c.4 1.7.8 3.1 1.8 3.1 1.3 0 1.9-2.4 2-3.9.1-1.8.6-3.4 1.2-5 .5-1.3 1.1-2.7 1.1-4.1 0-2.2-1.8-4-4-4-1.3 0-2.4.5-3.2 1.2-.5.4-1.1.4-1.6 0C10.4 3.5 9.3 3 8 3Z" />
                      </svg>
                    </div>
                    <p className="mt-3 text-sm font-bold" style={{ color: page.ink }}>Memory preview</p>
                    <p className="mt-1 text-xs" style={{ color: page.muted }}>The family memory is loading.</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-1">
                {[
                  [totalEscrowed.toFixed(totalEscrowed >= 1 ? 2 : 3), "SOL already saved", page.goldSoft, page.gold],
                  [String(liveDeposits.filter(d => !d.claimed).length), "family gifts", page.purpleSoft, page.purple],
                  ["age 10", "default hold", page.tealSoft, page.teal],
                ].map(([value, label, bg, color]) => (
                  <div key={label} className="rounded-lg px-3 py-4" style={{ background: bg, border: `1px solid ${page.border}` }}>
                    <p className="text-lg font-black" style={{ color: color as string }}>{value}</p>
                    <p className="mt-1 text-[11px]" style={{ color: page.muted }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mt-5 rounded-lg px-4 py-3"
              style={{ background: page.cream, border: `1px solid ${page.border}` }}
            >
              <p className="text-sm font-bold" style={{ color: page.ink }}>Memory first. Gifts optional.</p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: page.muted }}>
                This is a family ritual first. The fund can grow later, one small gift at a time.
              </p>
            </div>
          </div>

          <section className="rounded-lg p-5 md:p-6" style={{ background: page.paper, border: `1px solid ${page.border}`, boxShadow: "0 18px 44px oklch(30% 0.035 65 / 0.08)" }}>
            {/* Existing deposits */}
            {liveDeposits.length > 0 && (
            <div className="mb-5 space-y-1 rounded-lg p-4" style={{ background: page.cream, border: `1px solid ${page.border}` }}>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: page.muted, letterSpacing: "0.14em" }}>
                {liveDeposits.length} gift{liveDeposits.length > 1 ? "s" : ""} &middot; saved so far
              </p>
              {liveDeposits.filter(d => !d.claimed).map((d, i) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span>{d.depositorName} <span style={{ color: page.muted }}>{d.lockLabel}</span></span>
                  <span className="font-mono">{d.amountSol.toFixed(2)} SOL</span>
                </div>
              ))}
            </div>
            )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-2xl p-4 text-center" style={{ background: "rgba(79, 184, 145, 0.12)", border: "1px solid rgba(79, 184, 145, 0.28)" }}>
              <div className="mb-1 text-sm font-black uppercase" style={{ color: page.ink }}>Saved</div>
              <p className="text-sm font-medium" style={{ color: C.emerald }}>{success}</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Your gift is recorded and held for the Smile Fund.</p>
            </div>
          )}

          {/* Connect wallet prompt */}
          {!publicKey && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase" style={{ color: page.gold, letterSpacing: "0.16em" }}>Gift options</p>
                <h3
                  className="mt-2 text-3xl leading-tight"
                  style={{ color: page.ink, fontFamily: "var(--font-display), 'Alegreya', Georgia, serif", fontWeight: 700 }}
                >
                  Add a small gift.
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: page.inkSoft }}>
                  Card gifts open soon. For now, share the memory first or use
                  the advanced wallet path only for controlled testing.
                </p>
              </div>
              <div className="rounded-lg p-4" style={{ background: page.cream, border: `1px solid ${page.border}` }}>
                <p className="text-sm font-semibold" style={{ color: page.ink }}>How the Smile Fund works</p>
                <div className="mt-3 grid gap-2 text-sm" style={{ color: page.inkSoft }}>
                  <span>1. The memory stays visible from the family link.</span>
                  <span>2. Gifts are optional and parent-controlled.</span>
                  <span>3. The child can grow into the ownership lesson later.</span>
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ background: page.goldSoft, border: `1px solid rgba(216,164,60,0.24)` }}>
                <p className="text-sm font-semibold" style={{ color: page.ink }}>Card gifts are paused.</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: page.inkSoft }}>
                  Share the memory first. Advanced wallet testing is optional;
                  you can also simply come back to the memory.
                </p>
              </div>
              <button
                type="button"
                aria-label="Card gift checkout coming soon"
                disabled
                className="w-full rounded-full px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-80"
                style={{
                  background: page.gold,
                  boxShadow: "0 12px 30px rgba(216,164,60,0.20)",
                }}
              >
                Card gifts open soon
              </button>
              <p className="text-center text-xs leading-relaxed" style={{ color: page.muted }}>
                Provider checkout is in final review. Wallet testing stays separate.
              </p>
              <button
                type="button"
                onClick={requestWalletConnection}
                disabled={connecting || (connectIntent && !!wallet)}
                className="w-full rounded-full px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: page.purple, boxShadow: "0 12px 30px rgba(109,69,168,0.22)" }}
              >
                {connecting || (connectIntent && wallet)
                  ? "Connecting Phantom..."
                  : connectIntent
                    ? "Choose Phantom in the wallet window"
                    : "Advanced wallet test gift"}
              </button>
              {walletConnectError && (
                <p className="text-center text-xs leading-relaxed" style={{ color: C.rose }}>
                  {walletConnectError}
                </p>
              )}
              <Link href={`/toothfairy/keepsake/${milestonePda}`} className="block text-center text-xs underline" style={{ color: page.muted }}>
                Back to the memory
              </Link>
            </div>
          )}

          {publicKey && !childProfilePda && !error && (
            <div className="rounded-lg p-5 text-center" style={{ background: page.cream, border: `1px solid ${page.border}` }}>
              <p className="text-sm font-bold" style={{ color: page.ink }}>Loading the live gift account...</p>
              <p className="mt-1 text-xs" style={{ color: page.muted }}>This takes a moment after the wallet connects.</p>
            </div>
          )}

          {/* Deposit form */}
          {publicKey && childProfilePda && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-black uppercase" style={{ color: page.gold, letterSpacing: "0.16em" }}>Advanced wallet test gift</p>
                <p className="mt-1 text-sm font-bold" style={{ color: page.ink }}>Save a small gift for {displayChildName}</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {amountPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setDepositAmount(preset.amount)}
                    className="rounded-lg px-3 py-3 text-sm font-bold"
                    style={{
                      background: depositAmount === preset.amount ? page.gold : page.cream,
                      border: `1px solid ${depositAmount === preset.amount ? page.gold : page.border}`,
                      color: depositAmount === preset.amount ? "white" : page.ink,
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: page.muted }}>Your name</label>
                  <input type="text" value={depositorName} onChange={e => setDepositorName(e.target.value)} placeholder="Dad"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={{ borderColor: page.border, color: page.ink, background: page.cream }} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: page.muted }}>Gift amount (SOL)</label>
                  <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} min="0.01" step="0.05"
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none" style={{ borderColor: page.border, color: page.ink, background: page.cream }} />
                </div>
              </div>

              {/* Simplified lock: available now or suggested age 10 */}
              <div>
                <label className="block text-xs mb-2" style={{ color: page.muted }}>When can the child access it?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setLockChoice("now")} className="rounded-lg px-3 py-3 text-sm font-medium transition-all"
                    style={{ background: lockChoice === "now" ? "oklch(72% 0.145 75 / 0.12)" : page.cream, border: `2px solid ${lockChoice === "now" ? page.gold : page.border}`, color: lockChoice === "now" ? page.gold : page.muted }}>
                    Available now
                  </button>
                  <button onClick={() => setLockChoice("ageTen")} className="rounded-lg px-3 py-3 text-sm font-medium transition-all"
                    style={{ background: lockChoice === "ageTen" ? "oklch(72% 0.145 75 / 0.12)" : page.cream, border: `2px solid ${lockChoice === "ageTen" ? page.gold : page.border}`, color: lockChoice === "ageTen" ? page.gold : page.muted }}>
                    Hold until age 10
                  </button>
                </div>
              </div>

              {/* Early withdrawal warning */}
              {lockChoice === "ageTen" && (
                <div className="rounded-lg p-3" style={{ background: "rgba(216,164,60,0.10)", border: "1px solid rgba(216,164,60,0.24)" }}>
                  <p className="text-xs" style={{ color: page.inkSoft }}>
                    Age-10 gifts are held in the Tooth Fairy escrow program. Public card
                    checkout will spell out fees and early-withdrawal terms before payment.
                  </p>
                </div>
              )}

              <div className="rounded-lg p-4" style={{ background: page.goldSoft, border: `1px solid rgba(216,164,60,0.24)` }}>
                <p className="text-sm font-semibold" style={{ color: page.ink }}>Card gifts open soon.</p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: page.inkSoft }}>
                  Provider checkout is in final review. For now, use this wallet-only test path when you want to record a live gift.
                </p>
                <button
                  type="button"
                  aria-label="Card gift checkout coming soon"
                  disabled
                  className="mt-3 w-full rounded-full px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-80"
                  style={{
                    background: page.gold,
                    boxShadow: "0 12px 30px rgba(216,164,60,0.20)",
                  }}
                >
                  Card gifts open soon
                </button>
              </div>

              <button onClick={handleDeposit} disabled={loading || !depositorName.trim()}
                className="w-full px-4 py-3 rounded-full text-sm font-bold text-white disabled:opacity-30 transition-all hover:opacity-90" style={{ background: page.purple, color: "white", boxShadow: "0 12px 30px rgba(109,69,168,0.22)" }}>
                {loading ? "Saving gift..." : `${giftVerb} ${depositAmount} SOL for ${displayChildName}`}
              </button>
              <p className="text-xs text-center" style={{ color: page.muted }}>Approve in Phantom. SOL is held in the Tooth Fairy escrow program.</p>
            </div>
          )}

          {/* Back to profile */}
          {childProfileData?.childName && (
            <div className="text-center pt-4">
              <Link href={`/toothfairy/keepsake/${milestonePda}`} className="text-sm underline font-medium" style={{ color: page.gold }}>
                Back to {childProfileData.childName}&apos;s memory
              </Link>
            </div>
          )}

          <div className="text-center pt-2">
            <Link href="/toothfairy" className="text-xs underline" style={{ color: page.muted }}>What is Tooth Fairy Network?</Link>
          </div>
          </section>
        </div>
      )}

      <footer className="mt-12 pt-4 border-t text-center" style={{ borderColor: C.border }}>
        <p className="text-xs" style={{ color: page.muted }}>Tooth Fairy Network &middot; Memories today, savings tomorrow</p>
      </footer>
    </div>
    </div>
  )
}
