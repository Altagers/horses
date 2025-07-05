// Legacy stub to prevent import errors during build
// This will be removed once all references are cleaned up

export interface PowerPuffCharacter {
  name: string
  emoji: string
  description: string
  image: string
}

export const characters = {
  bubbles: {
    name: "Bubbles",
    emoji: "💙",
    description: "The sweetest fighter",
    image: "/bubbles.png",
  } as PowerPuffCharacter,
  blossom: {
    name: "Blossom",
    emoji: "🌸",
    description: "The leader",
    image: "/blossom.png",
  } as PowerPuffCharacter,
  buttercup: {
    name: "Buttercup",
    emoji: "💚",
    description: "The toughest fighter",
    image: "/buttercup.png",
  } as PowerPuffCharacter,
  "mojo jojo": {
    name: "Mojo Jojo",
    emoji: "🧠",
    description: "The evil genius",
    image: "/mojo.png",
  } as PowerPuffCharacter,
}
