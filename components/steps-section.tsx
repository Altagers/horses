"use client"

import { PostIt } from "./post-it"
import { Button } from "./button"
import { ShareButton } from "./share-button"
import { useOpenUrl } from "@coinbase/onchainkit/minikit"

export function StepsSection() {
  const openUrl = useOpenUrl()
  const steps = [
    {
      number: "1",
      heading: "DEPLOY TO VERCEL",
      body: "Click the deploy to Vercel button on the top right hand side of the screen.",
      verticalOffset: "normal" as const,
      color: "blue" as const,
      link: null,
    },
    {
      number: "2",
      heading: "SET ENV VARIABLES",
      body: "Add NEXT_PUBLIC_URL and other variables from .env.local to Vercel settings.",
      verticalOffset: "low" as const,
      color: "indigo" as const,
      link: {
        url: "https://vercel.com/docs/environment-variables",
        text: "If you want to learn more about Vercel variables click here",
      },
    },
    {
      number: "3",
      heading: "CREATE MANIFEST",
      body: "Use Warpcast manifest tool with your custody wallet to verify ownership.",
      verticalOffset: "high" as const,
      color: "sky" as const,
      link: {
        url: "https://farcaster.xyz/~/developers/mini-apps/manifest",
        text: "Create your manifest here",
      },
    },
    {
      number: "4",
      heading: "GO LIVE",
      body: "Test in Warpcast dev tools and share your mini app on Farcaster!",
      verticalOffset: "lower" as const,
      color: "yellow" as const,
      link: null,
    },
    {
      number: "5",
      heading: "TELL YOUR FRIENDS",
      body: "Share your amazing mini app with the Farcaster community!",
      verticalOffset: "normal" as const,
      color: "blue" as const,
      link: null,
    },
  ]

  return (
    <div className="py-12 flex flex-col items-center">
      <h2 className="text-3xl text-center font-bold mb-2 relative text-blue-800 w-full">
        Vibe code and make it yours!
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full max-w-xs h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
      </h2>
      <div className="flex flex-col gap-6 mb-8 max-w-lg mx-auto mt-12">
        {steps.map((step, index) => (
          <PostIt
            key={index}
            number={step.number}
            heading={step.heading}
            body={step.body}
            verticalOffset={step.verticalOffset}
            color={step.color}
            link={step.link}
          />
        ))}
      </div>

      {/* Share Section */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <ShareButton />
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => openUrl("https://base.org/builders/minikit")}
        >
          Built on Base with Minikit
        </Button>
      </div>
    </div>
  )
}
