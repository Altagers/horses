"use client"

import { getHorseFactById } from "@/lib/horse-facts"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Share2 } from "lucide-react"
import { useEffect } from "react"

interface PageProps {
  params: {
    factId: string
  }
}

export default function HorseFactClientPage({ params }: PageProps) {
  const factId = Number.parseInt(params.factId)
  const horseFact = getHorseFactById(factId)

  if (!horseFact) {
    notFound()
  }

  useEffect(() => {
    document.title = `${horseFact.title} | Horse Facts & Pics`
  }, [horseFact.title])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Image src="/logo.png" alt="Horse Facts & Pics" width={60} height={60} />
        </div>

        {/* Main Content */}
        <Card className="bg-white/95 backdrop-blur-sm border-2 border-amber-200 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <Image
                src={horseFact.image || "/placeholder.svg"}
                alt={horseFact.title}
                width={800}
                height={400}
                className="w-full h-80 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-3xl font-bold text-white mb-2">{horseFact.title}</h1>
                <p className="text-amber-200 text-sm">Horse Fact #{horseFact.id}</p>
              </div>
            </div>
            <div className="p-8">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">{horseFact.fact}</p>

              {/* Share Button */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: horseFact.title,
                        text: horseFact.fact,
                        url: window.location.href,
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share This Fact
                </Button>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="text-amber-700 border-amber-300 hover:bg-amber-50 bg-transparent"
                  >
                    Discover More Facts
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-amber-600 text-sm">Made with ❤️ for horse lovers everywhere</p>
        </div>
      </div>
    </div>
  )
}
