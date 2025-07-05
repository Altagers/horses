import HorseFactsAnalyzer from "@/components/horse-facts-analyzer"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-10 bg-gradient-to-br from-amber-50 to-amber-100 p-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Image src="/logo.png" alt="Horse Facts & Pics logo" width={120} height={120} priority />
        <h1 className="text-5xl font-bold text-amber-900">Horse Facts & Pics</h1>
        <p className="text-xl text-amber-700 max-w-lg">
          Tap the button below to reveal a fascinating horse fact paired with a beautiful image. Share it with friends
          on Farcaster!
        </p>
      </div>

      <HorseFactsAnalyzer />

      <p className="text-sm text-amber-500">
        First deployment URL:{" "}
        <a href="https://v0-powerpuff-girls-9j.vercel.app" className="underline">
          v0-powerpuff-girls-9j.vercel.app
        </a>
      </p>
    </main>
  )
}
