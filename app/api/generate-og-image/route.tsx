import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const factId = searchParams.get("factId") ?? "0"
  const factImage = searchParams.get("factImage") ?? "/banner.png"

  const fontData = await fetch(`${process.env.NEXT_PUBLIC_URL ?? ""}/Matemasie-Regular.woff`).then((res) =>
    res.arrayBuffer(),
  )

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAF5E9",
        fontFamily: "Matemasie",
      }}
    >
      {/* Background image */}
      <img
        src={factImage || "/placeholder.svg"}
        style={{
          objectFit: "cover",
          width: "1200px",
          height: "400px",
        }}
      />
      <div
        style={{
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <h1 style={{ fontSize: "48px", color: "#4E2602" }}>Amazing Horse Fact #{factId}</h1>
        <p style={{ fontSize: "32px", color: "#6B3A0B" }}>Find out more at Horse Facts & Pics!</p>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Matemasie",
          data: fontData,
          style: "normal",
        },
      ],
    },
  )
}
