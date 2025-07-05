"use client"

import type { ReactNode } from "react"
import { MiniKitProvider } from "@coinbase/onchainkit/minikit"
import { base } from "wagmi/chains"; // or your preferred chain config

export function MiniKitContextProvider({ children }: { children: ReactNode }) {
  return (
    <MiniKitProvider apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
    chain={base} 
    config={{
        appearance: {
          mode: "auto",
          theme: "mini-app-theme",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      {children}
    </MiniKitProvider>
  )
}
