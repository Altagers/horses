"use client"

import { useState } from "react"
import { sdk } from "@farcaster/frame-sdk"
import { PpgButton } from "./ppg-button"
import type { PowerPuffCharacter } from "@/lib/characters"

interface ShareResultButtonProps {
  character: PowerPuffCharacter
  onReset: () => void
}

export function ShareResultButton({ character, onReset }: ShareResultButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const appBaseUrl = "https://v0-mini-open-ai.vercel.app" // Hardcoded for reliability

  const handleShare = async () => {
    setStatus("loading")
    setErrorMessage(null)

    // Construct the URL for the shareable HTML page
    // Example: https://v0-mini-open-ai.vercel.app/s/Bubbles
    const sharePageUrl = new URL(`/s/${encodeURIComponent(character.name)}`, appBaseUrl).toString()

    const castText = `I'm ${character.name}! ${character.emoji} Which PowerPuff Girl are you? Find out on PowerPuff Analyzer!`

    try {
      await sdk.actions.composeCast({
        text: castText,
        embeds: [sharePageUrl], // Embed the URL of the HTML page with OG tags
      })
      setStatus("idle")
    } catch (error) {
      console.error("❌ Failed to share cast:", error)
      setStatus("error")
      setErrorMessage("Failed to open Farcaster composer.")
    }
  }

  const characterPpgColors: Record<string, "primary" | "bubbles" | "blossom" | "buttercup" | "mojo"> = {
    Bubbles: "bubbles",
    Blossom: "blossom",
    Buttercup: "buttercup",
    "Mojo Jojo": "mojo",
  }
  const buttonVariant = characterPpgColors[character.name] || "primary"

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <PpgButton
        onClick={handleShare}
        disabled={status === "loading"}
        variant={buttonVariant}
        className="w-full text-xl"
        sparkles
      >
        {status === "loading" ? "Preparing Share..." : `Share Your Result!`}
      </PpgButton>
      {status === "error" && <p className="text-red-500 font-body mt-2">{errorMessage}</p>}
    </div>
  )
}
