// Simple sentiment analysis to match PowerPuff Girls characters
export interface PowerPuffCharacter {
  name: string
  emoji: string
  color: string
  trait: string
  description: string
}

export const characters: Record<string, PowerPuffCharacter> = {
  bubbles: {
    name: "Bubbles",
    emoji: "💙",
    color: "blue",
    trait: "Sweet & Optimistic",
    description: "You're cheerful, kind, and see the best in everyone. Your posts spread joy and positivity!",
  },
  blossom: {
    name: "Blossom",
    emoji: "🌸",
    trait: "Leader & Smart",
    color: "pink",
    description: "You're analytical, thoughtful, and often take charge. Your posts show intelligence and leadership!",
  },
  buttercup: {
    name: "Buttercup",
    emoji: "💚",
    trait: "Tough & Rebellious",
    color: "green",
    description: "You're direct, strong-willed, and don't hold back. Your posts show your fierce independence!",
  },
  mojojo: {
    name: "Mojo Jojo",
    emoji: "🧠",
    trait: "Scheming Genius",
    color: "purple",
    description: "You're clever, strategic, and have big plans. Your posts reveal your brilliant and complex mind!",
  },
}
