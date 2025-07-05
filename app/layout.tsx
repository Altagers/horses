import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { MiniKitContextProvider } from "@/provider/minikit-provider"

export const metadata: Metadata = {
  title: "Horse Facts & Pics",
  description: "Discover amazing horse facts with beautiful pictures! Share fascinating equine knowledge on Farcaster.",
  generator: "v0.dev",
  openGraph: {
    title: "Horse Facts & Pics",
    description: "Discover amazing horse facts with beautiful pictures!",
    images: [{ url: "https://v0-powerpuff-girls-9j.vercel.app/banner.png", width: 1200, height: 630 }],
    type: "website",
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://v0-powerpuff-girls-9j.vercel.app/banner.png",
      button: {
        title: "Discover Horse Facts",
        action: {
          type: "launch_frame",
          name: "Horse Facts & Pics",
          url: "https://v0-powerpuff-girls-9j.vercel.app",
          splashImageUrl: "https://v0-powerpuff-girls-9j.vercel.app/splash.png",
          splashBackgroundColor: "#8B4513",
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
      <body className="font-sans antialiased">
        <MiniKitContextProvider>{children}</MiniKitContextProvider>
      </body>
    </html>
  )
}
