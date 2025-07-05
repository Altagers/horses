export interface HorseFact {
  id: number
  fact: string
  image: string
  title: string
}

export const horseFacts: HorseFact[] = [
  {
    id: 1,
    fact: "Horses cannot breathe through their mouths—only through their nostrils.",
    image: "/1.png",
    title: "Breathing Facts",
  },
  {
    id: 2,
    fact: "Their eyes are located on the sides of their heads, providing almost 360-degree vision, but there are blind spots in front and behind them.",
    image: "/2.png",
    title: "Vision Facts",
  },
  {
    id: 3,
    fact: "Horses have the largest eyes of any land mammal.",
    image: "/3.png",
    title: "Eye Facts",
  },
  {
    id: 4,
    fact: "They can sleep standing up thanks to a 'locking mechanism' in their joints, but they need to lie down for deep sleep.",
    image: "/4.png",
    title: "Sleep Facts",
  },
  {
    id: 5,
    fact: "A horse's heart weighs about 4–5 kg and can pump up to 250 liters of blood per minute during intense running.",
    image: "/5.png",
    title: "Heart Facts",
  },
  {
    id: 6,
    fact: "A horse's teeth grow throughout its life, and their wear can be used to determine the horse's age.",
    image: "/6.png",
    title: "Teeth Facts",
  },
  {
    id: 7,
    fact: "Horses do not have a gallbladder, but this does not prevent them from digesting plant food.",
    image: "/7.png",
    title: "Digestion Facts",
  },
  {
    id: 8,
    fact: "Horses have excellent memories and can recognize people even after many years.",
    image: "/8.png",
    title: "Memory Facts",
  },
  {
    id: 9,
    fact: "They use facial expressions to communicate and have more than 17 distinct facial expressions.",
    image: "/9.png",
    title: "Communication Facts",
  },
  {
    id: 10,
    fact: "Horses are capable of learning to open doors, unscrew lids, and use simple mechanisms.",
    image: "/10.png",
    title: "Intelligence Facts",
  },
]

// Function to get a random horse fact
export function getRandomHorseFact(): HorseFact {
  const randomIndex = Math.floor(Math.random() * horseFacts.length)
  return horseFacts[randomIndex]
}

// Function to get horse fact by ID
export function getHorseFactById(id: number): HorseFact | undefined {
  return horseFacts.find((fact) => fact.id === id)
}
