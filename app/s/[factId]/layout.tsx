import type React from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getHorseFactById } from "@/lib/horse-facts"

type Props = {
  params: { factId: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: { params: { factId: string } }): Promise<Metadata> {
  const factId = Number(params.factId)
  const fact = getHorseFactById(factId)

  if (!fact) {
    return {
      title: "Horse Fact Not Found",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://v0-powerpuff-girls-9j.vercel.app"
  const og = `${baseUrl}/api/generate-og-image?factId=${fact.id}&factImage=${encodeURIComponent(fact.image)}&v=${Date.now()}`

  console.log("Layout metadata for fact:", fact.id, "OG URL:", og)

  return {
    title: `${fact.title} | Horse Facts & Pics`,
    description: fact.fact,
    openGraph: {
      title: fact.title,
      description: fact.fact,
      images: [{ url: og, width: 1200, height: 630, alt: fact.title }],
      type: "article",
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": og,
      "fc:frame:button:1": `🐴 ${fact.title} - Open Horse Facts!`,
      "fc:frame:button:1:action": "launch_frame",
      "fc:frame:button:1:target": JSON.stringify({
        type: "launch_frame",
        name: "Horse Facts & Pics",
        url: baseUrl,
        splashImageUrl: `${baseUrl}/splash.png`,
        splashBackgroundColor: "#8B4513",
      }),
    },
  }
}

export default function FactLayout({ children, params }: Props) {
  const factId = Number(params.factId)
  const fact = getHorseFactById(factId)

  if (!fact) notFound()

  return <>{children}</>
}
