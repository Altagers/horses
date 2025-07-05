/**
 * Library of horse facts + helpers
 */

export interface HorseFact {
  /** 1-based id that matches /public/{id}.png */
  id: number
  /** Short headline used in cards & OG titles */
  title: string
  /** Full sentence/paragraph fact text */
  fact: string
  /** Public image path for the fact (e.g. "/1.png") */
  image: string
}

export const horseFacts: HorseFact[] = [
  {
    id: 1,
    title: "Horses breathe only through their nostrils",
    fact: "Horses cannot breathe through their mouths—only through their nostrils.",
    image: "/1.png",
  },
  {
    id: 2,
    title: "Almost 360-degree vision",
    fact: "Their eyes are located on the sides of their heads, providing almost 360-degree vision, but there are blind spots in front and behind them.",
    image: "/2.png",
  },
  {
    id: 3,
    title: "Largest eyes of land mammals",
    fact: "Horses have the largest eyes of any land mammal.",
    image: "/3.png",
  },
  {
    id: 4,
    title: "Sleep standing up",
    fact: "They can sleep standing up thanks to a locking mechanism in their joints, but they need to lie down for deep sleep.",
    image: "/4.png",
  },
  {
    id: 5,
    title: "Powerful heart",
    fact: "A horse’s heart weighs about 4–5 kg and can pump up to 250 litres of blood per minute during intense running.",
    image: "/5.png",
  },
  {
    id: 6,
    title: "Teeth that never stop growing",
    fact: "A horse’s teeth grow throughout its life, and their wear can be used to determine the horse’s age.",
    image: "/6.png",
  },
  {
    id: 7,
    title: "No gallbladder",
    fact: "Horses do not have a gallbladder, but this does not prevent them from digesting plant food.",
    image: "/7.png",
  },
  {
    id: 8,
    title: "Excellent memory",
    fact: "Horses have excellent memories and can recognize people even after many years.",
    image: "/8.png",
  },
  {
    id: 9,
    title: "17+ facial expressions",
    fact: "They use facial expressions to communicate and have more than 17 distinct facial expressions.",
    image: "/9.png",
  },
  {
    id: 10,
    title: "Clever problem-solvers",
    fact: "Horses are capable of learning to open doors, unscrew lids, and use simple mechanisms.",
    image: "/10.png",
  },
]

export function getHorseFactById(id: number): HorseFact | undefined {
  return horseFacts.find((f) => f.id === id)
}

export function getRandomHorseFact(): HorseFact {
  return horseFacts[Math.floor(Math.random() * horseFacts.length)]
}
