"use client"

import { useEffect } from "react"
import { useMiniKit } from "@coinbase/onchainkit/minikit"
import { Name } from "@coinbase/onchainkit/identity"
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from "@coinbase/onchainkit/wallet"
import { SentimentAnalyzer } from "@/components/sentiment-analyzer"
import { PpgButton } from "@/components/ppg-button"
import { Sparkles } from "lucide-react" // Using Lucide Sparkles for a cleaner look

// Simple Sparkle component for background decoration
const BgSparkle = ({
  top,
  left,
  size = "w-8 h-8",
  rotate = "0",
  delay = "0s",
}: { top: string; left: string; size?: string; rotate?: string; delay?: string }) => (
  <Sparkles
    className={`absolute text-white/70 ${size} transform rotate-${rotate} animate-pulse`}
    style={{ top, left, animationDelay: delay }}
  />
)

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit()

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  return (
    <div
      className="relative min-h-screen flex flex-col items-center p-4 pt-8 selection:bg-pink-300 selection:text-pink-900 overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #FFD1DC, #FFE5B4)", // Pastel Pink to Peachy Yellow
      }}
    >
      {/* Background Sparkles */}
      <BgSparkle top="10%" left="15%" size="w-12 h-12" rotate="12" delay="0.2s" />
      <BgSparkle top="20%" left="80%" size="w-10 h-10" rotate="-15" delay="0.5s" />
      <BgSparkle top="60%" left="5%" size="w-16 h-16" rotate="5" delay="0.8s" />
      <BgSparkle top="75%" left="90%" size="w-14 h-14" rotate="-5" delay="0.3s" />
      <BgSparkle top="40%" left="45%" size="w-8 h-8" rotate="20" delay="0.6s" />

      {/* Themed Header - z-10 to be above sparkles but below modals if any */}
      <header className="relative z-10 w-full max-w-xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-[#F283B3] border-[4px] border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center sm:text-left">
          <h1 className="font-heading text-4xl text-ppg-title leading-tight">PowerPuff Analyzer</h1>
          <p className="font-body text-lg text-black font-medium">Discover your inner superhero!</p>
        </div>
        
      </header>

      {/* Main sentiment analyzer component - z-10 as well */}
      <div className="relative z-10">
        <SentimentAnalyzer />
      </div>

      <footer className="relative z-10 mt-12 text-center">
        <p className="font-body text-sm text-gray-700">Made with sugar, spice, and everything nice (and code!)</p>
      </footer>
    </div>
  )
}
