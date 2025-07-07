import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { getHorseFactById } from "@/lib/horse-facts"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const factId = searchParams.get("factId")
    const factImagePublicPath = searchParams.get("factImage")
    const timestamp = searchParams.get("t")

    console.log("OG Image Generation Request:", {
      factId,
      factImagePublicPath,
      timestamp,
      url: req.url,
    })

    if (!factId || !factImagePublicPath) {
      console.error("Missing parameters:", { factId, factImagePublicPath })
      return new Response("Missing fact information", { status: 400 })
    }

    const horseFact = getHorseFactById(Number.parseInt(factId))
    if (!horseFact) {
      console.error("Horse fact not found:", factId)
      return new Response("Horse fact not found", { status: 404 })
    }

    const baseUrl = "https://v0-powerpuff-girls-9j.vercel.app"
    const factImageUrl = `${baseUrl}${factImagePublicPath}`

    console.log("Generating OG image for:", {
      factId: horseFact.id,
      title: horseFact.title,
      imageUrl: factImageUrl,
      timestamp,
    })

    // Создаем уникальный цвет фона для каждого факта
    const backgroundColors = [
      "#8B4513", // Saddle Brown
      "#A0522D", // Sienna
      "#CD853F", // Peru
      "#D2691E", // Chocolate
      "#B8860B", // Dark Goldenrod
      "#DAA520", // Goldenrod
      "#F4A460", // Sandy Brown
      "#DEB887", // Burlywood
      "#BC8F8F", // Rosy Brown
      "#D2B48C", // Tan
    ]

    const bgColor = backgroundColors[horseFact.id % backgroundColors.length]

    const response = new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bgColor,
          padding: "40px",
          border: "8px solid #D2691E",
          borderRadius: "24px",
          position: "relative",
        }}
      >
        {/* Уникальный элемент для каждого факта */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "#D2691E",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          Fact #{horseFact.id}
        </div>

        {/* Уникальный декоративный элемент */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            fontSize: "32px",
          }}
        >
          🐴
        </div>

        <img
          src={factImageUrl || "/placeholder.svg"}
          width={400}
          height={250}
          style={{
            borderRadius: "16px",
            border: "4px solid white",
            marginBottom: "30px",
            objectFit: "cover",
            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
          }}
          alt={horseFact.title}
        />

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
            margin: "0 0 20px 0",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          {horseFact.title}
        </h1>

        <p
          style={{
            fontSize: "24px",
            color: "#F4A460",
            textAlign: "center",
            maxWidth: "90%",
            lineHeight: 1.4,
            textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          {horseFact.fact.length > 100 ? horseFact.fact.substring(0, 100) + "..." : horseFact.fact}
        </p>

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
            textAlign: "center",
            fontSize: "16px",
            color: "rgba(255,255,255,0.8)",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          Horse Facts & Pics • Unique ID: {timestamp}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )

    // Правильные заголовки кэширования для динамических изображений
    response.headers.set("Cache-Control", "public, immutable, no-transform, max-age=300")
    response.headers.set("Vary", "Accept")
    response.headers.set("Content-Type", "image/png")

    return response
  } catch (e: any) {
    console.error(`OG Image Error:`, e)
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 })
  }
}
