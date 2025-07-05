import type { Metadata, ResolvingMetadata } from "next"
import { getHorseFactById } from "@/lib/horse-facts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

type Props = {
  params: { factId: string }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const factId = Number.parseInt(params.factId)
  const horseFact = getHorseFactById(factId)

  const appBaseUrl = process.env.NEXT_PUBLIC_URL || "https://v0-powerpuff-girls-9j.vercel.app"
  const appName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Horse Facts & Pics"

  const appIcon = process.env.NEXT_PUBLIC_APP_ICON || "/logo.png"
  const appIconUrl = appIcon.startsWith("http")
    ? appIcon
    : `${appBaseUrl}${appIcon.startsWith("/") ? "" : "/"}${appIcon}`

  const appSplashImage = process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || "/splash.png"
  const appSplashImageUrl = appSplashImage.startsWith("http")
    ? appSplashImage
    : `${appBaseUrl}${appSplashImage.startsWith("/") ? "" : "/"}${appSplashImage}`

  const appSplashBackgroundColor = process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#8B4513"
  const defaultFcFrameImage = process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${appBaseUrl}/banner.png`

  let frameDefinition: any

  if (!horseFact) {
    frameDefinition = {
      version: "next",
      imageUrl: defaultFcFrameImage,
      button: {
        title: "Discover Horse Facts",
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
      title: "Horse Facts & Pics - Amazing Horse Facts",
      description: "Discover fascinating horse facts with beautiful pictures!",
      openGraph: {
        title: "Horse Facts & Pics",
        description: "Discover amazing horse facts!",
        images: [{ url: defaultFcFrameImage }],
      },
      other: {
        "fc:frame": JSON.stringify(frameDefinition),
      },
    }
  }

  const dynamicImageUrl = new URL("/api/generate-og-image", appBaseUrl)
  dynamicImageUrl.searchParams.set("factId", horseFact.id.toString())
  dynamicImageUrl.searchParams.set("factImage", horseFact.image)

  frameDefinition = {
    version: "next",
    imageUrl: dynamicImageUrl.toString(),
    button: {
      title: `Amazing Horse Fact! Discover More`,
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
    title: `${horseFact.title} - Horse Facts & Pics`,
    description: `🐴 ${horseFact.fact}`,
    openGraph: {
      title: `🐴 ${horseFact.title}`,
      description: horseFact.fact,
      images: [{ url: dynamicImageUrl.toString(), width: 1200, height: 630, alt: horseFact.title }],
    },
    other: {
      "fc:frame": JSON.stringify(frameDefinition),
    },
  }
}

export default function SharePage({ params }: Props) {
  const factId = Number.parseInt(params.factId)
  const horseFact = getHorseFactById(factId)
  const appBaseUrl = process.env.NEXT_PUBLIC_URL || "https://v0-powerpuff-girls-9j.vercel.app"

  if (!horseFact) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 to-amber-200 p-8 text-center">
        <Card className="max-w-lg w-full">
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-6">Oops! Fact Not Found</h1>
            <p className="text-xl text-amber-700 mb-8">We couldn't find that horse fact.</p>
            <a href={appBaseUrl}>
              <Button className="text-xl bg-amber-600 hover:bg-amber-700">Discover Horse Facts!</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ogImageUrl = `${appBaseUrl}/api/generate-og-image?factId=${encodeURIComponent(horseFact.id.toString())}&factImage=${encodeURIComponent(horseFact.image)}`

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-100 to-amber-200 p-8 text-center">
      <Card className="max-w-2xl w-full overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={ogImageUrl || "/placeholder.svg"}
              alt={horseFact.title}
              width={600}
              height={315}
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">This horse fact was shared:</h2>
            <h3 className="text-2xl font-semibold text-amber-800 mb-4">{horseFact.title}</h3>
            <p className="text-lg text-amber-700 mb-8 leading-relaxed">{horseFact.fact}</p>
            <a href={appBaseUrl}>
              <Button className="text-xl bg-amber-600 hover:bg-amber-700">Discover More Horse Facts!</Button>
            </a>
          </div>
        </CardContent>
      </Card>
      <p className="text-sm text-amber-600 mt-8">
        You were viewing a shared horse fact. Click above to discover more amazing facts!
      </p>
    </div>
  )
}
