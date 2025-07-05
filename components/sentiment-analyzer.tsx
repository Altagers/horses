"use client"

import { useState } from "react"
import { useMiniKit } from "@coinbase/onchainkit/minikit"
import type { PowerPuffCharacter } from "@/lib/characters"
import Image from "next/image"
import { PpgButton } from "./ppg-button"
import { ShareResultButton } from "./share-result-button" // Import the new component

const PowerPuffGirlsHeaderImage = () => (
  <div className=" flex justify-center">
    <div>
      <Image
        src="/hero_powerpuff.png"
        alt="The PowerPuff Girls"
        width={280}
        height={140}
        className="object-cover"
        priority
      />
    </div>
  </div>
)

type AnalysisResult = {
  character: PowerPuffCharacter
}

export function SentimentAnalyzer() {
  const { context } = useMiniKit()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    const userFid = context?.user?.fid // Get FID from MiniKit context

    if (!userFid) {
      setError("Please connect your Farcaster account (via Wallet) to analyze posts.")
      setLoading(false)
      setResult(null)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    console.log(`Frontend: Determined FID to query: ${userFid}`)

    try {
      const response = await fetch("/api/analyze-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fid: userFid }), // Send the connected user's FID
      })
      const data = await response.json()
      if (!response.ok || data.error) throw new Error(data.error || "Analysis failed")
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    return <ResultScreen result={result} onReset={() => setResult(null)} />
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <PowerPuffGirlsHeaderImage />
      <div className="relative bg-[#F9A826] border-[5px] border-black rounded-[40px] p-6 pt-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="font-heading text-5xl md:text-6xl leading-none text-ppg-title mb-8 relative">
          Which
          <br />
          Powerpuff
          <br />
          Girl Are You?
        </h1>
        <PpgButton
          onClick={handleAnalyze}
          disabled={loading || !context?.user?.fid}
          variant="buttercup"
          className="w-full text-xl"
          sparkles
        >
          {loading ? "Analyzing..." : !context?.user?.fid ? "Connect Wallet to Analyze" : "Analyze My Posts!"}
        </PpgButton>
      </div>
      {error && (
        <div className="mt-6 p-4 bg-red-400 border-4 border-black rounded-2xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-white font-heading text-2xl text-ppg-button-light">{error}</p>
        </div>
      )}
    </div>
  )
}

function ResultScreen({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  const characterPpgColors: Record<string, "primary" | "bubbles" | "blossom" | "buttercup" | "mojo"> = {
    Bubbles: "bubbles",
    Blossom: "blossom",
    Buttercup: "buttercup",
    "Mojo Jojo": "mojo",
  }

  const characterImagePlaceholders: Record<string, string> = {
    Bubbles: "/bubbles.png",
    Blossom: "/blossom.png",
    Buttercup: "/buttercup.png",
    "Mojo Jojo": "/mojo.png",
  }

  const characterName = result.character.name
  const buttonVariant = characterPpgColors[characterName] || "primary"

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6 flex flex-col items-center">
      <PpgButton variant={buttonVariant} className="mb-8 w-full md:w-auto text-3xl" disabled sparkles>
        You're {characterName}!
      </PpgButton>
      <div className="mb-8 bg-white p-3 border-[5px] border-black rounded-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <Image
          src={
            characterImagePlaceholders[characterName] || "/placeholder.svg?width=200&height=200&query=Unknown+Character"
          }
          alt={characterName}
          width={200}
          height={200}
          className="rounded-full"
        />
      </div>
      <div className="relative bg-white border-[5px] border-black rounded-3xl p-6 w-full mb-10 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-xl font-body font-semibold text-black">{result.character.description}</p>
        <div className="absolute left-1/2 -bottom-[19px] transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[20px] border-t-black" />
        <div className="absolute left-1/2 -bottom-[14px] transform -translate-x-1/2 w-0 h-0 border-l-[17px] border-l-transparent border-r-[17px] border-r-transparent border-t-[17px] border-t-white" />
      </div>
      {/* Replace the PpgButton with ShareResultButton */}
      <ShareResultButton character={result.character} onReset={onReset} />
    </div>
  )
}
