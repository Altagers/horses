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
  // Добавляем уникальный параметр для каждого факта
  const og = `${baseUrl}/api/generate-og-image?factId=${fact.id}&factImage=${encodeURIComponent(fact.image)}&v=2`

  console.log("Generating metadata for fact:", fact.id, "OG URL:", og)

  return {
    title: `${fact.title} | Horse Facts & Pics`,
    description: fact.fact,
    // Полностью перекрываем все метадата из layout
    openGraph: {
      title: fact.title,
      description: fact.fact,
      images: [{ url: og, width: 1200, height: 630, alt: fact.title }],
      type: "article",
      url: `${baseUrl}/s/${fact.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: fact.title,
      description: fact.fact,
      images: [og],
    },
    other: {
      // Полностью перекрываем fc:frame из layout
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: og,
        button: {
          title: `🐴 ${fact.title} - Open Horse Facts!`,
          action: {
            type: "launch_frame",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Horse Facts & Pics",
            url: baseUrl,
            splashImageUrl: `${baseUrl}/splash.png`,
            splashBackgroundColor: "#8B4513",
          },
        },
      }),
      // Добавляем дополнительные метатеги для принудительного обновления
      "fc:frame:image": og,
      "fc:frame:button:1": `🐴 ${fact.title} - Open Horse Facts!`,
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
