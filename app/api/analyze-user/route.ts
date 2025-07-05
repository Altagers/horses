import { type NextRequest, NextResponse } from "next/server"
import { getHorseFactById } from "@/lib/horse-facts"
import { analyzePostsForHorseFacts, getAnalysisDetails } from "@/lib/horse-keyword-analyzer"

export const maxDuration = 60

/**
 * Horse Facts API - анализирует посты пользователя и возвращает подходящий факт о лошадях
 * Использует внутренний механизм анализа ключевых слов вместо OpenAI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const fid = body.fid

    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 })
    }

    console.log(`Backend: Received request for horse fact analysis from FID: ${fid}`)

    // Симулируем задержку анализа для лучшего UX
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let analysisResult
    let horseFact
    let debugInfo = null

    // Пытаемся получить посты пользователя из Neynar API
    if (process.env.NEYNAR_API_KEY) {
      try {
        console.log(`Backend: Fetching posts from Neynar API for FID: ${fid}`)

        const neynarResponse = await fetch(
          `https://api.neynar.com/v2/farcaster/feed/user/popular?fid=${fid}&limit=20`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              api_key: process.env.NEYNAR_API_KEY,
            },
          },
        )

        if (neynarResponse.ok) {
          const neynarData = await neynarResponse.json()
          const castTexts = neynarData.casts?.map((cast: any) => cast.text).filter(Boolean) || []

          console.log(`Backend: Found ${castTexts.length} posts for FID ${fid}`)

          if (castTexts.length > 0) {
            // Анализируем посты с помощью нашего внутреннего механизма
            const detailedAnalysis = getAnalysisDetails(castTexts)
            analysisResult = detailedAnalysis.analysis
            debugInfo = detailedAnalysis.debugInfo

            console.log(`Backend: Analysis result for FID ${fid}:`, {
              selectedFactId: analysisResult.selectedFactId,
              matchedCategories: analysisResult.matchedCategories,
              confidence: analysisResult.confidence,
            })
          }
        } else {
          console.warn(`Backend: Neynar API error for FID ${fid}: ${neynarResponse.status}`)
        }
      } catch (neynarError) {
        console.error(`Backend: Error fetching from Neynar for FID ${fid}:`, neynarError)
      }
    }

    // Если не удалось получить посты или проанализировать, используем случайный факт
    if (!analysisResult) {
      console.log(`Backend: Using fallback random fact for FID ${fid}`)
      analysisResult = analyzePostsForHorseFacts([]) // Пустой массив вернет случайный факт
    }

    // Получаем факт по ID
    horseFact = getHorseFactById(analysisResult.selectedFactId)

    if (!horseFact) {
      console.error(`Backend: Horse fact with ID ${analysisResult.selectedFactId} not found`)
      // Fallback к первому факту
      horseFact = getHorseFactById(1)
    }

    console.log(`Backend: Returning horse fact ${horseFact?.id} for FID ${fid}`)

    return NextResponse.json({
      horseFact,
      analysis: {
        selectedFactId: analysisResult.selectedFactId,
        matchedCategories: analysisResult.matchedCategories,
        confidence: analysisResult.confidence,
        keywordMatches: analysisResult.keywordMatches,
      },
      debugInfo: process.env.NODE_ENV === "development" ? debugInfo : undefined,
      success: true,
    })
  } catch (error) {
    console.error("Backend: Error in horse facts analysis route:", error)

    // Fallback к случайному факту даже при ошибке
    const fallbackAnalysis = analyzePostsForHorseFacts([])
    const horseFact = getHorseFactById(fallbackAnalysis.selectedFactId) || getHorseFactById(1)

    return NextResponse.json({
      horseFact,
      analysis: fallbackAnalysis,
      success: true,
      error: "Analysis failed, returned random fact",
    })
  }
}
