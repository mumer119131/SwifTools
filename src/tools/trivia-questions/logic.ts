export type Category = "general" | "science" | "history" | "geography" | "arts" | "sport";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  question: string;
  answer: string;
  category: Category;
  difficulty: Difficulty;
}

/**
 * A curated bank rather than a live API.
 *
 * Every trivia API worth using needs a key or rate-limits hard, and a quiz that
 * fails because someone else's server is down is worse than a smaller bank that
 * always works. Answers are checked facts, not guesses.
 */
export const QUESTIONS: Question[] = [
  // General knowledge
  { category: "general", difficulty: "easy", question: "How many sides does a hexagon have?", answer: "Six" },
  { category: "general", difficulty: "easy", question: "What is the largest mammal on Earth?", answer: "The blue whale" },
  { category: "general", difficulty: "easy", question: "How many minutes are in a full day?", answer: "1,440" },
  { category: "general", difficulty: "medium", question: "What does the 'www' in a web address stand for?", answer: "World Wide Web" },
  { category: "general", difficulty: "medium", question: "Which unit measures the loudness of sound?", answer: "The decibel" },
  { category: "general", difficulty: "medium", question: "What is the only food that never spoils?", answer: "Honey" },
  { category: "general", difficulty: "hard", question: "What is the collective noun for a group of crows?", answer: "A murder" },
  { category: "general", difficulty: "hard", question: "In which year was the first email sent?", answer: "1971, by Ray Tomlinson" },
  { category: "general", difficulty: "hard", question: "What is the study of flags called?", answer: "Vexillology" },

  // Science
  { category: "science", difficulty: "easy", question: "What gas do plants absorb from the atmosphere?", answer: "Carbon dioxide" },
  { category: "science", difficulty: "easy", question: "How many bones are in the adult human body?", answer: "206" },
  { category: "science", difficulty: "easy", question: "What is the chemical symbol for gold?", answer: "Au" },
  { category: "science", difficulty: "medium", question: "What is the most abundant element in the universe?", answer: "Hydrogen" },
  { category: "science", difficulty: "medium", question: "Which planet has the shortest day?", answer: "Jupiter, at about 10 hours" },
  { category: "science", difficulty: "medium", question: "What does DNA stand for?", answer: "Deoxyribonucleic acid" },
  { category: "science", difficulty: "hard", question: "What is the speed of light in a vacuum, to three significant figures?", answer: "299,000 km per second (exactly 299,792,458 m/s)" },
  { category: "science", difficulty: "hard", question: "Which particle was discovered at CERN in 2012?", answer: "The Higgs boson" },
  { category: "science", difficulty: "hard", question: "What is the half-life of carbon-14?", answer: "About 5,730 years" },

  // History
  { category: "history", difficulty: "easy", question: "In which year did the Second World War end?", answer: "1945" },
  { category: "history", difficulty: "easy", question: "Who was the first person to walk on the Moon?", answer: "Neil Armstrong" },
  { category: "history", difficulty: "easy", question: "Which ancient civilisation built the pyramids at Giza?", answer: "The ancient Egyptians" },
  { category: "history", difficulty: "medium", question: "In which year did the Berlin Wall fall?", answer: "1989" },
  { category: "history", difficulty: "medium", question: "Who was the first woman to win a Nobel Prize?", answer: "Marie Curie, in 1903" },
  { category: "history", difficulty: "medium", question: "Which war was fought between 1955 and 1975 in South-East Asia?", answer: "The Vietnam War" },
  { category: "history", difficulty: "hard", question: "How long did the Hundred Years' War actually last?", answer: "116 years, from 1337 to 1453" },
  { category: "history", difficulty: "hard", question: "Which empire was ruled by Mansa Musa, often called the richest person in history?", answer: "The Mali Empire" },
  { category: "history", difficulty: "hard", question: "In which year was the printing press invented by Gutenberg?", answer: "Around 1440" },

  // Geography
  { category: "geography", difficulty: "easy", question: "What is the longest river in the world?", answer: "The Nile — though the Amazon is contested" },
  { category: "geography", difficulty: "easy", question: "Which country has the most people?", answer: "India, since 2023" },
  { category: "geography", difficulty: "easy", question: "On which continent is the Sahara Desert?", answer: "Africa" },
  { category: "geography", difficulty: "medium", question: "What is the smallest country in the world by area?", answer: "Vatican City" },
  { category: "geography", difficulty: "medium", question: "Which two countries share the longest land border?", answer: "Canada and the United States" },
  { category: "geography", difficulty: "medium", question: "What is the capital of Australia?", answer: "Canberra — not Sydney" },
  { category: "geography", difficulty: "hard", question: "Which is the only sea with no coastline?", answer: "The Sargasso Sea" },
  { category: "geography", difficulty: "hard", question: "How many time zones does Russia span?", answer: "Eleven" },
  { category: "geography", difficulty: "hard", question: "Which country has the most islands?", answer: "Sweden, with over 260,000" },

  // Arts and culture
  { category: "arts", difficulty: "easy", question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
  { category: "arts", difficulty: "easy", question: "How many strings does a standard violin have?", answer: "Four" },
  { category: "arts", difficulty: "easy", question: "Who wrote Romeo and Juliet?", answer: "William Shakespeare" },
  { category: "arts", difficulty: "medium", question: "Which artist cut off part of his own ear?", answer: "Vincent van Gogh" },
  { category: "arts", difficulty: "medium", question: "What is the best-selling album of all time?", answer: "Michael Jackson's Thriller" },
  { category: "arts", difficulty: "medium", question: "Which novel begins 'Call me Ishmael'?", answer: "Moby-Dick" },
  { category: "arts", difficulty: "hard", question: "Which composer wrote his ninth symphony while profoundly deaf?", answer: "Ludwig van Beethoven" },
  { category: "arts", difficulty: "hard", question: "What is the oldest surviving printed book?", answer: "The Diamond Sutra, from 868 AD" },
  { category: "arts", difficulty: "hard", question: "Who directed the film Seven Samurai?", answer: "Akira Kurosawa" },

  // Sport
  { category: "sport", difficulty: "easy", question: "How many players are on a football pitch per team?", answer: "Eleven" },
  { category: "sport", difficulty: "easy", question: "How often are the Summer Olympics held?", answer: "Every four years" },
  { category: "sport", difficulty: "easy", question: "In tennis, what is a score of zero called?", answer: "Love" },
  { category: "sport", difficulty: "medium", question: "How long is a marathon?", answer: "26.2 miles, or 42.195 km" },
  { category: "sport", difficulty: "medium", question: "Which country has won the most FIFA World Cups?", answer: "Brazil, with five" },
  { category: "sport", difficulty: "medium", question: "In cricket, what is a score of zero by a batter called?", answer: "A duck" },
  { category: "sport", difficulty: "hard", question: "What is the maximum break in snooker?", answer: "147" },
  { category: "sport", difficulty: "hard", question: "Which sport is played at Flushing Meadows?", answer: "Tennis — the US Open" },
  { category: "sport", difficulty: "hard", question: "In which year did the modern Olympic Games first take place?", answer: "1896, in Athens" },
];

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Mixed" },
  { id: "general", label: "General" },
  { id: "science", label: "Science" },
  { id: "history", label: "History" },
  { id: "geography", label: "Geography" },
  { id: "arts", label: "Arts" },
  { id: "sport", label: "Sport" },
];

export function filter(
  category: Category | "all",
  difficulty: Difficulty | "all",
): Question[] {
  return QUESTIONS.filter(
    (question) =>
      (category === "all" || question.category === category) &&
      (difficulty === "all" || question.difficulty === difficulty),
  );
}
