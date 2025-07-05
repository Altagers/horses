"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMiniKit } from "@coinbase/onchainkit/minikit"
import type { HorseFact } from "@/lib/horse-facts"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShareResultButton } from "./share-result-button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Target } from "lucide-react"

const HorseFactsHeaderImage = () => (
  <div className="flex justify-center mb-6">
    <div className="relative">
      <Image src="/logo.png" alt="Horse Facts & Pics" width={200} height={100} className="object-contain" priority />
    </div>
  </div>
)

type AnalysisResult = {
  horseFact: HorseFact
  analysis?: {
    selectedFactId: number
    matchedCategories: string[]
    confidence: number
    keywordMatches: { [category: string]: string[] }
  }
}

export default function HorseFactsAnalyzer() {
  const { context } = useMiniKit()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<number | null>(null)

  const handleAnalyze = async () => {
    const userFid = context?.user?.fid

    if (!userFid) {
      setError("Please connect your Farcaster account to get personalized horse facts.")
      setLoading(false)
      setResult(null)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log("Frontend: Starting analysis for FID:", userFid)

      // Вызываем наш API для анализа
      const response = await fetch("/api/analyze-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fid: userFid }),
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("Frontend: Analysis response:", data)

      if (data.success && data.horseFact) {
        const analysisResult: AnalysisResult = {
          horseFact: data.horseFact,
          analysis: data.analysis,
        }

        setResult(analysisResult)
        setPreviewId(data.horseFact.id)

        // Через 2 секунды переходим на страницу с результатом
        setTimeout(() => {
          router.push(`/s/${data.horseFact.id}`)
        }, 2000)
      } else {
        throw new Error("Invalid response from analysis API")
      }
    } catch (err) {
      console.error("Frontend: Analysis error:", err)
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const previewSrc = previewId ? `/${previewId}.png` : "/banner.png"

  if (result) {
    return <ResultScreen result={result} onReset={() => setResult(null)} />
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <HorseFactsHeaderImage />
      <Card className="bg-white/95 backdrop-blur-sm border-2 border-amber-200 shadow-2xl">
        <CardContent className="p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4 leading-tight">
            Get Your Personal
            <br />
            Horse Fact!
          </h1>
          <p className="text-amber-700 mb-6 text-sm">We'll analyze your posts to find the perfect horse fact for you</p>
          <Button
            onClick={handleAnalyze}
            disabled={loading || !context?.user?.fid}
            className="w-full text-lg py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            {loading ? (
              <>
                <Brain className="w-5 h-5 mr-2 animate-pulse" />
                Analyzing Your Posts...
              </>
            ) : !context?.user?.fid ? (
              "Connect Wallet to Start"
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                Analyze My Posts!
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      {error && (
        <Card className="mt-6 bg-red-50 border-2 border-red-200">
          <CardContent className="p-4 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </CardContent>
        </Card>
      )}
      <Card className="w-full max-w-lg mt-6">
        <CardContent className="p-6 flex flex-col items-center gap-6">
          <Image
            src={previewSrc || "/placeholder.svg"}
            alt="Horse fact preview"
            width={400}
            height={225}
            className="rounded-md border"
          />
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700" onClick={handleAnalyze}>
            Get My Personal Horse Fact
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function ResultScreen({ result, onReset }: { result: AnalysisResult; onReset: () => void }) {
  return (
    <div className="w-full max-w-lg mx-auto p-4 flex flex-col items-center">
      <Card className="mb-8 bg-white/95 backdrop-blur-sm border-2 border-amber-200 shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={result.horseFact.image || "/placeholder.svg"}
              alt={result.horseFact.title}
              width={500}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white mb-2">{result.horseFact.title}</h2>
              {result.analysis && result.analysis.confidence > 0 && (
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Target className="w-4 h-4" />
                  <span>{result.analysis.confidence}% match based on your posts</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">{result.horseFact.fact}</p>

            {result.analysis && result.analysis.matchedCategories.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Why this fact?</strong> Based on your posts about{" "}
                  {result.analysis.matchedCategories.join(", ")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="w-full space-y-4">
        <ShareResultButton horseFact={result.horseFact} onReset={onReset} />
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full text-amber-700 border-amber-300 hover:bg-amber-50 bg-transparent"
        >
          Analyze Again
        </Button>
      </div>
    </div>
  )
}
