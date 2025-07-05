import { getHorseFactById } from "@/lib/horse-facts"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import HorseFactClientPage from "./HorseFactClientPage"

interface PageProps {
  params: {
    factId: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const factId = Number.parseInt(params.factId)
  const horseFact = getHorseFactById(factId)

  if (!horseFact) {
    return {
      title: "Horse Fact Not Found",
      description: "The requested horse fact could not be found.",
    }
  }

  const baseUrl = "https://v0-powerpuff-girls-9j.vercel.app"
  const ogImageUrl = `${baseUrl}/api/generate-og-image?factId=${factId}&factImage=${encodeURIComponent(horseFact.image)}`

  return {
    title: `${horseFact.title} | Horse Facts & Pics`,
    description: horseFact.fact,
    openGraph: {
      title: horseFact.title,
      description: horseFact.fact,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: horseFact.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: horseFact.title,
      description: horseFact.fact,
      images: [ogImageUrl],
    },
  }
}

export default function HorseFactPage({ params }: PageProps) {
  const factId = Number.parseInt(params.factId)
  const horseFact = getHorseFactById(factId)

  if (!horseFact) {
    notFound()
  }

  return <HorseFactClientPage params={params} />
}
