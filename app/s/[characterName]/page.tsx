import type { Metadata, ResolvingMetadata } from "next"
import { characters } from "@/lib/characters"
import { PpgButton } from "@/components/ppg-button" // Keep for fallback page

type Props = {
  params: { characterName: string }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const characterNameParam = decodeURIComponent(params.characterName)
  const character = Object.values(characters).find((c) => c.name.toLowerCase() === characterNameParam.toLowerCase())

  const appBaseUrl = process.env.NEXT_PUBLIC_URL || "https://v0-mini-open-ai.vercel.app"
  const appName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "PowerPuff Analyzer"

  // Ensure icon and splash URLs are absolute and have defaults
  const appIcon = process.env.NEXT_PUBLIC_APP_ICON || "/icon.png"
  const appIconUrl = appIcon.startsWith("http")
    ? appIcon
    : `${appBaseUrl}${appIcon.startsWith("/") ? "" : "/"}${appIcon}`

  const appSplashImage = process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || "/splash.png"
  const appSplashImageUrl = appSplashImage.startsWith("http")
    ? appSplashImage
    : `${appBaseUrl}${appSplashImage.startsWith("/") ? "" : "/"}${appSplashImage}`

  const appSplashBackgroundColor = process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#FFD1DC"
  const defaultFcFrameImage = process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${appBaseUrl}/hero_powerpuff.png`

  // Define the frame structure based on your working example
  let frameDefinition: any

  if (!character) {
    frameDefinition = {
      version: "next", // As per your example
      imageUrl: defaultFcFrameImage,
      button: {
        title: "Open Analyzer",
        action: {
          type: "launch_frame",
          name: appName,
          url: appBaseUrl,
          splashImageUrl: appSplashImageUrl,
          splashBackgroundColor: appSplashBackgroundColor,
        },
      },
    }
    return {
      title: "PowerPuff Analyzer Result",
      description: "See which PowerPuff Girl you are!",
      openGraph: {
        // Fallback OG tags
        title: "PowerPuff Analyzer",
        description: "Which PowerPuff Girl are you? Find out!",
        images: [{ url: defaultFcFrameImage }],
      },
      other: {
        "fc:frame": JSON.stringify(frameDefinition),
      },
    }
  }

  const characterImageMap: Record<string, string> = {
    Bubbles: "/bubbles.png",
    Blossom: "/blossom.png",
    Buttercup: "/buttercup.png",
    "Mojo Jojo": "/mojo.png",
  }
  const characterImagePublicPath = characterImageMap[character.name] || "/placeholder.svg"

  const dynamicImageUrl = new URL("/api/generate-og-image", appBaseUrl)
  dynamicImageUrl.searchParams.set("characterName", character.name)
  dynamicImageUrl.searchParams.set("characterImage", characterImagePublicPath)

  frameDefinition = {
    version: "next", // As per your example
    imageUrl: dynamicImageUrl.toString(), // Dynamic image for the character
    button: {
      title: `I'm ${character.name}! Open Analyzer`, // Button title
      action: {
        type: "launch_frame",
        name: appName, // Name of the Mini App to launch
        url: appBaseUrl, // URL of the Mini App to launch
        splashImageUrl: appSplashImageUrl,
        splashBackgroundColor: appSplashBackgroundColor,
      },
    },
  }

  return {
    title: `I'm ${character.name}! - PowerPuff Analyzer Result`,
    description: `I found out I'm ${character.name} using the PowerPuff Analyzer! ${character.description}`,
    // OpenGraph tags as fallback for other platforms
    openGraph: {
      title: `I'm ${character.name}! ${character.emoji}`,
      description: character.description,
      images: [{ url: dynamicImageUrl.toString(), width: 1200, height: 630, alt: `${character.name} Result` }],
    },
    // Farcaster Frame metadata using the single JSON object structure
    other: {
      "fc:frame": JSON.stringify(frameDefinition),
    },
  }
}

// Fallback page content (remains the same)
export default function SharePage({ params }: Props) {
  const characterNameParam = decodeURIComponent(params.characterName)
  const character = Object.values(characters).find((c) => c.name.toLowerCase() === characterNameParam.toLowerCase())
  const appBaseUrl = process.env.NEXT_PUBLIC_URL || "https://v0-mini-open-ai.vercel.app"

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-8 text-center">
        <h1 className="text-4xl font-heading text-ppg-title mb-6">Oops! Character Not Found</h1>
        <p className="font-body text-xl text-black mb-8">We couldn't find that PowerPuff result.</p>
        <a href={appBaseUrl}>
          <PpgButton variant="primary" className="text-xl">
            Take the Quiz!
          </PpgButton>
        </a>
      </div>
    )
  }

  const characterImageMap: Record<string, string> = {
    Bubbles: "/bubbles.png",
    Blossom: "/blossom.png",
    Buttercup: "/buttercup.png",
    "Mojo Jojo": "/mojo.png",
  }
  const characterImagePublicPath = characterImageMap[character.name] || "/placeholder.svg"
  const ogImageUrl = `${appBaseUrl}/api/generate-og-image?characterName=${encodeURIComponent(character.name)}&characterImage=${encodeURIComponent(characterImagePublicPath)}`

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-8 text-center">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-4 border-black max-w-lg w-full">
        <h2 className="font-heading text-ppg-title text-3xl mb-2">This result was shared:</h2>
        <img
          src={ogImageUrl || "/placeholder.svg"}
          alt={`${character.name} Result`}
          width={400}
          height={210}
          className="rounded-lg shadow-xl border-2 border-black mx-auto mb-6"
        />
        <p className="font-body text-xl text-black mb-8">
          It looks like someone shared their result: They're {character.name}! {character.emoji}
        </p>
        <a href={appBaseUrl}>
          <PpgButton variant="primary" className="text-xl">
            Find YOUR Personality!
          </PpgButton>
        </a>
      </div>
      <p className="font-body text-sm text-black mt-8">
        You were viewing a shared result. Click above to take the quiz yourself!
      </p>
    </div>
  )
}
