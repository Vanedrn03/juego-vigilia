export interface PrizeLevelView {
  step: number;
  label: string;
  points: number;
  isCheckpoint: boolean;
}

export interface QuestionView {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  verseRef: string | null;
  correctOption: "A" | "B" | "C" | "D" | null;
}

export interface SessionQuestionView {
  id: string;
  step: number;
  answeredOption: "A" | "B" | "C" | "D" | null;
  isCorrect: boolean | null;
  revealedFiftyOptions: string[] | null;
  question: QuestionView;
}

export interface ParticipantView {
  id: string;
  name: string;
  order: number;
  score: number;
  currentStep: number;
  status: "ACTIVE" | "WON" | "WALKED_AWAY" | "LOST";
  lifelineFiftyUsed: boolean;
  lifelineLeaderUsed: boolean;
  lifelineTeamUsed: boolean;
  sessionQuestions: SessionQuestionView[];
}

export interface GameSessionView {
  id: string;
  mode: "TEAMS" | "INDIVIDUAL";
  status: "SETUP" | "IN_PROGRESS" | "FINISHED";
  participants: ParticipantView[];
}
