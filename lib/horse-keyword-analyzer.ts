export interface KeywordCategory {
  name: string
  keywords: string[]
  factIds: number[]
  description: string
}

// Категории ключевых слов для определения подходящих фактов о лошадях
export const keywordCategories: KeywordCategory[] = [
  {
    name: "breathing",
    keywords: ["breath", "breathing", "air", "nose", "nostrils", "oxygen", "respiratory", "lungs"],
    factIds: [1], // Факт о дыхании через ноздри
    description: "Posts about breathing, air, or respiratory topics",
  },
  {
    name: "vision",
    keywords: ["see", "vision", "eyes", "look", "watch", "sight", "view", "observe", "visual", "perspective"],
    factIds: [2, 3], // Факты о зрении и глазах
    description: "Posts about vision, seeing, or visual perception",
  },
  {
    name: "sleep",
    keywords: ["sleep", "tired", "rest", "nap", "dream", "bed", "wake", "sleepy", "insomnia", "lying"],
    factIds: [4], // Факт о сне стоя
    description: "Posts about sleep, rest, or being tired",
  },
  {
    name: "health",
    keywords: ["heart", "health", "fitness", "exercise", "run", "running", "cardio", "workout", "strong", "energy"],
    factIds: [5], // Факт о сердце
    description: "Posts about health, fitness, or physical activity",
  },
  {
    name: "age",
    keywords: ["age", "old", "young", "years", "birthday", "grow", "growing", "teeth", "dental", "time"],
    factIds: [6], // Факт о зубах и возрасте
    description: "Posts about age, growing up, or time",
  },
  {
    name: "food",
    keywords: ["food", "eat", "eating", "digest", "stomach", "hungry", "meal", "nutrition", "diet", "plant"],
    factIds: [7], // Факт о пищеварении
    description: "Posts about food, eating, or digestion",
  },
  {
    name: "memory",
    keywords: ["remember", "memory", "forget", "recall", "past", "friend", "friendship", "recognize", "familiar"],
    factIds: [8], // Факт о памяти
    description: "Posts about memory, remembering, or friendships",
  },
  {
    name: "communication",
    keywords: ["talk", "speak", "communication", "express", "face", "emotion", "feeling", "smile", "sad", "happy"],
    factIds: [9], // Факт о мимике
    description: "Posts about communication, emotions, or expressions",
  },
  {
    name: "intelligence",
    keywords: ["smart", "clever", "learn", "learning", "solve", "problem", "think", "brain", "intelligent", "open"],
    factIds: [10], // Факт об интеллекте
    description: "Posts about intelligence, learning, or problem-solving",
  },
]

export interface AnalysisResult {
  selectedFactId: number
  matchedCategories: string[]
  keywordMatches: { [category: string]: string[] }
  confidence: number
}

/**
 * Анализирует тексты постов и определяет наиболее подходящий факт о лошадях
 */
export function analyzePostsForHorseFacts(posts: string[]): AnalysisResult {
  if (!posts || posts.length === 0) {
    // Если нет постов, возвращаем случайный факт
    const randomFactId = Math.floor(Math.random() * 10) + 1
    return {
      selectedFactId: randomFactId,
      matchedCategories: [],
      keywordMatches: {},
      confidence: 0,
    }
  }

  // Объединяем все посты в один текст и приводим к нижнему регистру
  const allText = posts.join(" ").toLowerCase()

  // Подсчитываем совпадения для каждой категории
  const categoryScores: { [category: string]: { score: number; matches: string[] } } = {}

  keywordCategories.forEach((category) => {
    const matches: string[] = []
    let score = 0

    category.keywords.forEach((keyword) => {
      // Ищем точные совпадения слов (не подстроки)
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      const keywordMatches = allText.match(regex)

      if (keywordMatches) {
        matches.push(...keywordMatches)
        score += keywordMatches.length
      }
    })

    if (score > 0) {
      categoryScores[category.name] = { score, matches }
    }
  })

  // Находим категорию с наивысшим счетом
  let bestCategory: string | null = null
  let bestScore = 0

  Object.entries(categoryScores).forEach(([categoryName, data]) => {
    if (data.score > bestScore) {
      bestScore = data.score
      bestCategory = categoryName
    }
  })

  // Определяем факт на основе лучшей категории
  let selectedFactId: number
  const matchedCategories: string[] = []
  const keywordMatches: { [category: string]: string[] } = {}

  if (bestCategory && bestScore > 0) {
    const category = keywordCategories.find((cat) => cat.name === bestCategory)!
    // Выбираем случайный факт из доступных в категории
    selectedFactId = category.factIds[Math.floor(Math.random() * category.factIds.length)]
    matchedCategories.push(bestCategory)
    keywordMatches[bestCategory] = categoryScores[bestCategory].matches
  } else {
    // Если нет совпадений, выбираем случайный факт
    selectedFactId = Math.floor(Math.random() * 10) + 1
  }

  // Вычисляем уверенность (0-100%)
  const totalWords = allText.split(/\s+/).length
  const confidence = totalWords > 0 ? Math.min(100, (bestScore / totalWords) * 100) : 0

  return {
    selectedFactId,
    matchedCategories,
    keywordMatches,
    confidence: Math.round(confidence),
  }
}

/**
 * Получает детальную информацию об анализе для отладки
 */
export function getAnalysisDetails(posts: string[]): {
  analysis: AnalysisResult
  debugInfo: {
    totalPosts: number
    totalWords: number
    allCategories: { [category: string]: { score: number; matches: string[] } }
  }
} {
  const allText = posts.join(" ").toLowerCase()
  const totalWords = allText.split(/\s+/).length

  const allCategories: { [category: string]: { score: number; matches: string[] } } = {}

  keywordCategories.forEach((category) => {
    const matches: string[] = []
    let score = 0

    category.keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      const keywordMatches = allText.match(regex)

      if (keywordMatches) {
        matches.push(...keywordMatches)
        score += keywordMatches.length
      }
    })

    allCategories[category.name] = { score, matches }
  })

  const analysis = analyzePostsForHorseFacts(posts)

  return {
    analysis,
    debugInfo: {
      totalPosts: posts.length,
      totalWords,
      allCategories,
    },
  }
}
