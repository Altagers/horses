import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { getHorseFactById } from "@/lib/horse-facts"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const factId = searchParams.get("factId")
    const factImagePublicPath = searchParams.get("factImage")
    const timestamp = searchParams.get("t") // Для уникальности

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

    const response = new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#8B4513",
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
          }}
        >
          Fact #{horseFact.id}
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
          }}
          alt={horseFact.title}
        />

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            margin: "0 0 20px 0",
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          🐴 {horseFact.title}
        </h1>

        <p
          style={{
            fontSize: "24px",
            color: "#F4A460",
            textAlign: "center",
            maxWidth: "90%",
            lineHeight: 1.4,
            textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          {horseFact.fact.length > 120 ? horseFact.fact.substring(0, 120) + "..." : horseFact.fact}
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
          }}
        >
          Horse Facts & Pics • {timestamp ? new Date(Number(timestamp)).toLocaleString() : "Now"}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )

    // Добавляем заголовки для предотвращения кэширования
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Vary", "*")

    return response
  } catch (e: any) {
    console.error(`OG Image Error:`, e)
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 })
  }
}
