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

    console.log("OG Image Generation:", { factId, factImagePublicPath, url: req.url })

    if (!factId || !factImagePublicPath) {
      console.error("Missing parameters:", { factId, factImagePublicPath })
      return new Response("Missing fact information", { status: 400 })
    }

    const horseFact = getHorseFactById(Number.parseInt(factId))
    if (!horseFact) {
      console.error("Horse fact not found:", factId)
      return new Response("Horse fact not found", { status: 404 })
    }

    // Создаем полный URL для изображения лошади
    const factImageUrl = `${baseUrl}${factImagePublicPath}`
    console.log("Generated image URL:", factImageUrl)

    // Добавляем заголовки для предотвращения кэширования
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
        {/* Добавляем уникальный элемент для каждого факта */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          #{horseFact.id}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )

    // Добавляем заголовки к ответу
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (e: any) {
    console.error(`OG Image Error: Failed to generate ImageResponse:`, e.message)
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 })
  }
}
