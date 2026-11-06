import type { Level } from "./types";

export type PlacementQuestion = {
  prompt: string;
  choices: [string, string, string];
  answer: number;
};

// Original questions: a short orientation for the route, not a CEFR certification.
export const placementQuestions: PlacementQuestion[] = [
  { prompt: "She ___ from Lima.", choices: ["am", "is", "are"], answer: 1 },
  { prompt: "I ___ coffee every morning.", choices: ["drink", "drinks", "drinking"], answer: 0 },
  { prompt: "___ you live near your friends?", choices: ["Are", "Do", "Does"], answer: 1 },
  { prompt: "Yesterday I ___ a story.", choices: ["write", "wrote", "written"], answer: 1 },
  { prompt: "We didn't ___ to the park.", choices: ["went", "go", "gone"], answer: 1 },
  { prompt: "I've lived here ___ 2020.", choices: ["for", "since", "during"], answer: 1 },
  { prompt: "If it rains, we ___ at home.", choices: ["stay", "will stay", "stayed"], answer: 1 },
  { prompt: "I wish I ___ more time today.", choices: ["have", "had", "will have"], answer: 1 },
];

export function placementResult(answers: (number | null)[]): { level: Level; correct: number } {
  const correct = placementQuestions.reduce(
    (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
    0,
  );
  const groupScore = (start: number, end: number) => placementQuestions.slice(start, end).reduce(
    (score, question, index) => score + (answers[start + index] === question.answer ? 1 : 0), 0);
  const level = groupScore(0, 3) < 2 ? "A1" : groupScore(3, 6) < 2 ? "A2" : groupScore(6, 8) >= 1 ? "B1" : "A2";
  return { level, correct };
}
