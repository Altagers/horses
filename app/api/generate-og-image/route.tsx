import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { getHorseFactById } from "@/lib/horse-facts"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const factId = searchParams.get("factId")
    const factImagePublicPath = searchParams.get("factImage")

    const baseUrl = "https://v0-powerpuff-girls-9j.vercel.app"

    if (!factId || !factImagePublicPath) {
      return new Response("Missing fact information", { status: 400 })
    }

    const horseFact = getHorseFactById(Number.parseInt(factId))
    if (!horseFact) {
      return new Response("Horse fact not found", { status: 404 })
    }

    const factImageUrl = `${baseUrl}${factImagePublicPath}`

    return new ImageResponse(
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
        }}
      >
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
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.error(`OG Image Error: Failed to generate ImageResponse:`, e.message)
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 })
  }
}
