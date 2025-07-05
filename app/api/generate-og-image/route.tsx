import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { characters } from "@/lib/characters"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const characterName = searchParams.get("characterName")
    const characterImagePublicPath = searchParams.get("characterImage") // e.g., /bubbles.png

    // Hardcode the base URL for reliability
    const baseUrl = "https://v0-mini-open-ai.vercel.app"

    if (!characterName || !characterImagePublicPath) {
      return new Response("Missing character information", { status: 400 })
    }

    // Construct absolute URL for the character image
    const characterImageUrl = new URL(characterImagePublicPath, baseUrl).toString()

    const characterData = Object.values(characters).find((c) => c.name === characterName)
    if (!characterData) {
      return new Response("Character not found", { status: 404 })
    }

    const bgColor =
      characterData.name === "Bubbles"
        ? "#73D2F3" // Bubbles Blue
        : characterData.name === "Blossom"
          ? "#F283B3" // Blossom Pink
          : characterData.name === "Buttercup"
            ? "#A2E5B3" // Buttercup Green
            : characterData.name === "Mojo Jojo"
              ? "#C084FC" // Mojo Purple
              : "#F9A826" // Default Yellow/Orange

    return new ImageResponse(
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
          border: "10px solid black",
          borderRadius: "30px",
        }}
      >
        <img
          src={characterImageUrl || "/placeholder.svg"}
          width={300}
          height={300}
          style={{ borderRadius: "50%", border: "8px solid black", marginBottom: "30px" }}
          alt={characterName}
        />
        <h1
          style={{
            fontSize: "82px",
            fontWeight: "bold",
            color: "white",
            textShadow: "4px 4px 0 black, -4px -4px 0 black, 4px -4px 0 black, -4px 4px 0 black",
            margin: "0 0 20px 0",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          You are {characterName}! {characterData.emoji}
        </h1>
        <p
          style={{
            fontSize: "32px",
            color: "black",
            textAlign: "center",
            maxWidth: "90%",
            lineHeight: 1.3,
          }}
        >
          {characterData.description}
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
