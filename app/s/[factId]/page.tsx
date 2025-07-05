import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { getHorseFactById } from "@/lib/horse-facts"
import HorseFactClientPage from "./HorseFactClientPage"

type Props = {
  params: { factId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const factId = Number(params.factId)
  const fact = getHorseFactById(factId)

  if (!fact) {
    return {
      title: "Horse Fact Not Found",
      description: "The requested horse fact could not be found.",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://v0-powerpuff-girls-9j.vercel.app"
  // Добавляем timestamp для уникальности каждого изображения
  const timestamp = Date.now()
  const ogImageUrl = `${baseUrl}/api/generate-og-image?factId=${fact.id}&factImage=${encodeURIComponent(fact.image)}&t=${timestamp}`

  console.log("Generating metadata for fact:", fact.id, "OG URL:", ogImageUrl)

  return {
    title: `${fact.title} | Horse Facts & Pics`,
    description: fact.fact,
    openGraph: {
      title: fact.title,
      description: fact.fact,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: fact.title }],
      type: "article",
      url: `${baseUrl}/s/${fact.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: fact.title,
      description: fact.fact,
      images: [ogImageUrl],
    },
    other: {
      // Farcaster Frame метатеги
      "fc:frame": "vNext",
      "fc:frame:image": ogImageUrl,
      "fc:frame:image:aspect_ratio": "1.91:1",
      "fc:frame:button:1": `🐴 Open Horse Facts App`,
      "fc:frame:button:1:action": "launch_frame",
      "fc:frame:button:1:target": JSON.stringify({
        type: "launch_frame",
        name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Horse Facts & Pics",
        url: baseUrl,
        splashImageUrl: `${baseUrl}/splash.png`,
        splashBackgroundColor: "#8B4513",
      }),
    },
  }
}

export default function HorseFactPage({ params }: Props) {
  const factId = Number(params.factId)
  const fact = getHorseFactById(factId)

  if (!fact) notFound()

  return <HorseFactClientPage params={params} />
}
