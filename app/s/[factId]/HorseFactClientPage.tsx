"use client"

import Image from "next/image"

import { getHorseFactById } from "@/lib/horse-facts"
import { ShareResultButton } from "@/components/share-result-button"
import { Button } from "@/components/ui/button"

type Props = {
  params: { factId: string }
}

export default function HorseFactClientPage({ params }: Props) {
  const factId = Number(params.factId)
  const fact = getHorseFactById(factId)

  if (!fact) return null

  return (
    <main className="min-h-screen flex flex-col items-center gap-10 p-6">
      <div className="w-full max-w-3xl flex flex-col items-center gap-6">
        <Image
          src={fact!.image || "/placeholder.svg"}
          alt={fact!.title}
          width={800}
          height={450}
          className="rounded-xl border shadow-lg object-cover"
          priority
        />
        <h1 className="text-4xl font-bold text-amber-900 text-center">{fact!.title}</h1>
        <p className="text-lg text-amber-700 text-center max-w-2xl">{fact!.fact}</p>

        <div className="w-full flex flex-col sm:flex-row gap-4 mt-8">
          <ShareResultButton horseFact={fact!} onReset={() => null} />
          <Button
            variant="outline"
            className="w-full sm:w-auto text-amber-700 border-amber-300 hover:bg-amber-100 bg-transparent"
            onClick={() => history.back()}
          >
            ← Back
          </Button>
        </div>
      </div>
    </main>
  )
}
