"use client"

import { useState } from "react"
import { sdk } from "@farcaster/frame-sdk"
import { Button } from "@/components/ui/button"
import type { HorseFact } from "@/lib/horse-facts"
import { Share2 } from "lucide-react"

interface ShareResultButtonProps {
  horseFact: HorseFact
  onReset: () => void
}

export function ShareResultButton({ horseFact, onReset }: ShareResultButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const appBaseUrl = "https://v0-powerpuff-girls-9j.vercel.app"

  const handleShare = async () => {
    setStatus("loading")
    setErrorMessage(null)

    // Construct the URL for the shareable HTML page
    const sharePageUrl = new URL(`/s/${horseFact.id}`, appBaseUrl).toString()

    const castText = `🐴 Amazing Horse Fact: ${horseFact.fact.substring(0, 100)}${horseFact.fact.length > 100 ? "..." : ""} Discover more horse facts!`

    try {
      await sdk.actions.composeCast({
        text: castText,
        embeds: [sharePageUrl],
      })
      setStatus("idle")
    } catch (error) {
      console.error("❌ Failed to share cast:", error)
      setStatus("error")
      setErrorMessage("Failed to open Farcaster composer.")
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <Button
        onClick={handleShare}
        disabled={status === "loading"}
        className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        {status === "loading" ? (
          "Preparing Share..."
        ) : (
          <>
            <Share2 className="w-5 h-5 mr-2" />
            Share This Horse Fact!
          </>
        )}
      </Button>
      {status === "error" && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
    </div>
  )
}
