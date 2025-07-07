import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { getHorseFactById } from "@/lib/horse-facts"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const factId = searchParams.get("factId")
    const factImagePublicPath = searchParams.get("factImage")
    const timestamp = searchParams.get("t") || Date.now().toString()
    const sessionId = searchParams.get("sid") || "default"
    const version = searchParams.get("v") || "1"

    console.log("OG Image Generation Request:", {
      factId,
      factImagePublicPath,
      timestamp,
      sessionId,
      version,
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

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://v0-powerpuff-girls-9j.vercel.app"
    const factImageUrl = `${baseUrl}${factImagePublicPath}`

    // Создаем уникальные элементы для каждого факта и каждого шеринга
    const backgroundColors = [
      "#8B4513", "#A0522D", "#CD853F", "#D2691E", "#B8860B",
      "#DAA520", "#F4A460", "#DEB887", "#BC8F8F", "#D2B48C",
    ]

    const emojis = ["🐴", "🐎", "🏇", "🌾", "🥕", "🍎", "⭐", "💫", "🌟", "✨"]
    const patterns = ["🔥", "💎", "🌟", "⚡", "🎯", "🚀", "💪", "🎨", "🎭", "🎪"]

    const bgColor = backgroundColors[horseFact.id % backgroundColors.length]
    const emoji = emojis[horseFact.id % emojis.length]
    const pattern = patterns[horseFact.id % patterns.length]

    // Используем timestamp и sessionId для создания уникальных элементов
    const uniqueRotation = (Number(timestamp) % 360)
    const uniqueScale = 0.8 + (Number(sessionId.charCodeAt(0)) % 40) / 100

    console.log("Generating OG image for:", {
      factId: horseFact.id,
      title: horseFact.title,
      imageUrl: factImageUrl,
      timestamp,
      sessionId,
      bgColor,
      emoji,
      uniqueRotation,
      uniqueScale,
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
          backgroundColor: bgColor,
          padding: "40px",
          border: "8px solid #D2691E",
          borderRadius: "24px",
          position: "relative",
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}
      >
        {/* Уникальный номер факта с timestamp */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            backgroundColor: "#D2691E",
            color: "white",
            padding: "12px 20px",
            borderRadius: "25px",
            fontSize: "20px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            transform: `rotate(${uniqueRotation * 0.1}deg)`,
          }}
        >
          Fact #{horseFact.id}
        </div>

        {/* Уникальный эмодзи с анимацией */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            fontSize: "40px",
            transform: `rotate(${uniqueRotation * 0.2}deg) scale(${uniqueScale})`,
          }}
        >
          {emoji}
        </div>

        {/* Дополнительный паттерн для уникальности */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            fontSize: "30px",
            opacity: 0.7,
            transform: `rotate(${-uniqueRotation * 0.15}deg)`,
          }}
        >
          {pattern}
        </div>

        {/* Timestamp и session ID для уникальности */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "20px",
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          {new Date(Number(timestamp)).toLocaleTimeString()} • {sessionId.substring(0, 6)}
        </div>

        <img
          src={factImageUrl}
          width={400}
          height={250}
          style={{
            borderRadius: "16px",
            border: "4px solid white",
            marginBottom: "30px",
            objectFit: "cover",
            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
            transform: `rotate(${(horseFact.id % 2 === 0 ? 1 : -1) * 2}deg) scale(${uniqueScale})`,
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
            transform: `rotate(${uniqueRotation * 0.05}deg)`,
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
            right: "20px",
            textAlign: "center",
            fontSize: "16px",
            color: "rgba(255,255,255,0.8)",
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          Horse Facts & Pics • ID: {horseFact.id} • v{version}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )

    // Критически важные заголовки для предотвращения кэширования
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")
    response.headers.set("Vary", "*")
    response.headers.set("ETag", `"${timestamp}-${sessionId}-${version}"`)

    return response
  } catch (e: any) {
    console.error(`OG Image Error:`, e)
    return new Response(`Failed to generate image: ${e.message}`, { status: 500 })
  }
}