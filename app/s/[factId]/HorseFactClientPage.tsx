"use client"

import { notFound } from "next/navigation"
import { getHorseFactById } from "@/lib/horse-facts"
import Image from "next/image"
import { ShareResultButton } from "@/components/share-result-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface HorseFactClientPageProps {
  params: { factId: string }
}

export default function HorseFactClientPage({ params }: HorseFactClientPageProps) {
  const factId = Number(params.factId)
  const horseFact = getHorseFactById(factId)

  if (!horseFact) {
    notFound()
  }

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center gap-10 bg-gradient-to-br from-amber-50 to-amber-100 p-6">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-amber-700 border-amber-300 hover:bg-amber-100 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-amber-900">Horse Facts & Pics</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Main Fact Card */}
        <Card className="w-full max-w-3xl overflow-hidden shadow-2xl border-2 border-amber-200">
          <CardContent className="p-0">
            <div className="relative">
              <Image
                src={horseFact.image || "/placeholder.svg"}
                alt={horseFact.title}
                width={800}
                height={450}
                className="w-full h-64 md:h-96 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">{horseFact.title}</h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-xl text-amber-800 leading-relaxed mb-8">{horseFact.fact}</p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <ShareResultButton horseFact={horseFact} onReset={() => {}} />
                </div>
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="text-amber-700 border-amber-300 hover:bg-amber-100 bg-transparent"
                >
                  Discover More Facts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-amber-600 text-sm">Fact #{horseFact.id} of 10 amazing horse facts</p>
        </div>
      </div>
    </main>
  )
}
