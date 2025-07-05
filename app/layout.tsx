import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { MiniKitContextProvider } from "@/provider/minikit-provider"

export const metadata: Metadata = {
  title: "PowerPuff Personality Analyzer",
  description: "Which Powerpuff Girl Are You? Analyze your Farcaster posts to find out!",
  generator: "v0.dev",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://v0-mini-open-ai.vercel.app/pp_banner.png",
      button: {
        title: "Find your Powerpuff",
        action: {
          type: "launch_frame",
          name: "PowerPuff Analyzer",
          url: "https://v0-mini-open-ai.vercel.app",
          splashImageUrl: "https://v0-mini-open-ai.vercel.app/pp_banner.png",
          splashBackgroundColor: "#FFD1DC",
        },
      },
    }),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <MiniKitContextProvider>{children}</MiniKitContextProvider>
      </body>
    </html>
  )
}
