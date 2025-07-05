import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { characters } from "@/lib/characters" // Ensure this path is correct

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const fid = body.fid // Get FID from request body

    if (!fid) {
      throw new Error("FID not provided in the request body")
    }

    console.log(`Backend: Received request to analyze FID: ${fid}`) // Log the FID being queried

    // 1. Fetch user casts from Neynar API
    if (!process.env.NEYNAR_API_KEY) {
      throw new Error("Neynar API key not configured")
    }
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured")
    }

    console.log(`Backend: Querying Neynar API for FID: ${fid}`) // Log before Neynar call

    const neynarResponse = await fetch(`https://api.neynar.com/v2/farcaster/feed/user/popular?fid=${fid}&limit=10`, {
      method: "GET",
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY,
      },
    })

    if (!neynarResponse.ok) {
      const errorText = await neynarResponse.text()
      console.error(`Backend: Neynar API error for FID ${fid}: ${errorText}`)
      throw new Error(`Neynar API error: ${neynarResponse.status} - ${errorText}`)
    }

    const neynarData = await neynarResponse.json()
    const castTexts = neynarData.casts?.map((cast: any) => cast.text).filter(Boolean) || []

    if (castTexts.length === 0) {
      console.log(`Backend: No casts found for FID ${fid}. Defaulting to Bubbles.`)
      // If no casts, default to Bubbles (or handle as preferred)
      return NextResponse.json({ character: characters.bubbles })
    }

    // 2. Prepare the prompt and call OpenAI API
    const allPosts = castTexts.join("\n---\n")
    console.log(`Backend: Sending ${castTexts.length} cast(s) to OpenAI for FID ${fid}.`)

    const { text: characterName } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `You are a personality analyzer for PowerPuff Girls characters. Analyze the user's posts and determine which character they match best. Be specific and look for distinct patterns:

BUBBLES - The Joy Spreader:
- Uses lots of positive language, emojis, exclamation points
- Shares wholesome content, compliments others frequently
- Posts about cute things, animals, friendship, love
- Optimistic even about challenges, sees good in everything
- Language: "amazing!", "so cute!", "love this!", "wholesome", "sweet"

BLOSSOM - The Strategic Leader:
- Shares informative content, explains complex topics
- Takes charge in conversations, offers solutions
- Posts about planning, organization, learning, teaching
- Uses structured thinking, bullet points, step-by-step approaches
- Language: "strategy", "plan", "analyze", "solution", "research", "data"

BUTTERCUP - The Rebel Fighter:
- Direct, blunt communication style
- Challenges popular opinions, calls out problems
- Posts about injustice, fighting for causes, being authentic
- Uses strong language, doesn't sugarcoat things
- Language: "fight", "real talk", "honestly", "enough", "stand up", sarcasm

MOJO JOJO - The Mastermind:
- Complex, elaborate posts with sophisticated vocabulary
- Shares grand theories, ambitious projects, intellectual pursuits
- Posts about power, influence, complex schemes or ideas
- Verbose, dramatic language, talks about "plans" and "domination"
- Language: "brilliant", "scheme", "dominate", "superior", "elaborate", "mastermind"

Respond with ONLY the character name that best matches the overall pattern. Consider the dominant themes, not just individual posts.`,
      prompt: `Analyze these social media posts and determine which PowerPuff Girls character this person is most like:\n\n${allPosts}`,
      maxTokens: 15,
      temperature: 0.4, // Increased from 0.2 for more variety
    })

    console.log(`Backend: OpenAI response for FID ${fid}: ${characterName}`)

    // 3. Map the OpenAI response to our character data
    const normalizedCharacterName = characterName.trim().toLowerCase()
    const matchedCharacter = characters[normalizedCharacterName]

    if (!matchedCharacter) {
      console.error(
        `Backend: OpenAI returned an unknown character for FID ${fid}: '${characterName}'. Defaulting to Bubbles.`,
      )
      // Fallback if OpenAI returns an unexpected value
      return NextResponse.json({ character: characters.bubbles }) // Default to Bubbles
    }

    console.log(`Backend: Matched character for FID ${fid}: ${matchedCharacter.name}`)
    return NextResponse.json({
      character: matchedCharacter,
    })
  } catch (error) {
    console.error("Backend: Error in analyze-user route:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze user data",
      },
      { status: 500 },
    )
  }
}
