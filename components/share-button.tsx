"use client"

import { useMiniKit } from "@coinbase/onchainkit/minikit"
import { sdk } from "@farcaster/frame-sdk"

export function ShareButton() {
  const { context } = useMiniKit()

  const handleShare = async () => {
    const username = context?.user?.username ?? "someone"
    const text = `Babe wake up new MiniKit Demo just dropped 💅`

    try {
      await sdk.actions.composeCast({
        text,
        embeds: [process.env.NEXT_PUBLIC_URL || window.location.origin],
      })
    } catch (err) {
      console.error("Failed to open composer:", err)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="px-8 py-4 rounded-2xl border border-stone-200 font-semibold text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-sm min-w-[200px]"
    >
      Cast About This Mini App
    </button>
  )
}
