"use client"

import { useEffect } from "react"
import { useMiniKit } from "@coinbase/onchainkit/minikit"
import HorseFactsAnalyzer from "@/components/horse-facts-analyzer"
import { Sparkles, Heart } from "lucide-react"

// Simple decoration component for background
const BgDecoration = ({
  top,
  left,
  size = "w-6 h-6",
  rotate = "0",
  delay = "0s",
  icon: Icon = Sparkles,
}: {
  top: string
  left: string
  size?: string
  rotate?: string
  delay?: string
  icon?: any
}) => (
  <Icon
    className={`absolute text-amber-200/30 ${size} transform rotate-${rotate} animate-pulse`}
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
      className="relative min-h-screen flex flex-col items-center p-4 pt-8 selection:bg-amber-200 selection:text-amber-900 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #F4A460 100%)", // Brown to Sandy Brown gradient
      }}
    >
      {/* Background Decorations */}
      <BgDecoration top="10%" left="15%" size="w-8 h-8" rotate="12" delay="0.2s" />
      <BgDecoration top="20%" left="80%" size="w-6 h-6" rotate="-15" delay="0.5s" icon={Heart} />
      <BgDecoration top="60%" left="5%" size="w-10 h-10" rotate="5" delay="0.8s" />
      <BgDecoration top="75%" left="90%" size="w-8 h-8" rotate="-5" delay="0.3s" icon={Heart} />
      <BgDecoration top="40%" left="45%" size="w-6 h-6" rotate="20" delay="0.6s" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-2xl mb-8 flex flex-col items-center gap-4 p-6 bg-white/95 backdrop-blur-sm border border-amber-200 rounded-3xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 leading-tight mb-2">Horse Facts & Pics</h1>
          <p className="text-lg text-amber-700 font-medium">
            Discover amazing facts about horses with beautiful pictures
          </p>
        </div>
      </header>

      {/* Main analyzer component */}
      <div className="relative z-10">
        <HorseFactsAnalyzer />
      </div>

      <footer className="relative z-10 mt-12 text-center">
        <p className="text-sm text-amber-100">Made with ❤️ for horse lovers everywhere</p>
      </footer>
    </div>
  )
}
