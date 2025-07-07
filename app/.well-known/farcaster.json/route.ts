function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return !!value
    }),
  )
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "Horse Facts & Pics",
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE || "Discover Amazing Horse Facts",
      description:
        process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Learn fascinating facts about horses with beautiful pictures",
      screenshotUrls: [],
      iconUrl: process.env.NEXT_PUBLIC_APP_ICON || `${URL}/logo.png`,
      splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || `${URL}/splash.png`,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#8B4513",
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY || "education",
      tags: ["horses", "facts", "education", "animals"],
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${URL}/banner.png`,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "Amazing Horse Facts & Pictures",
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE || "Horse Facts & Pics",
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION || "Discover amazing horse facts",
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE || `${URL}/banner.png`,
    }),
  })
}
