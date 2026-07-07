export type FeudTeamKey = "TEAM_A" | "TEAM_B";
export type FeudPhase = "FACEOFF" | "PLAYING" | "STEAL" | "DONE";

export interface FeudAnswerSlotView {
  id: string;
  rank: number;
  revealed: boolean;
  text: string | null;
  points: number | null;
}

export interface FeudRoundView {
  id: string;
  roundNumber: number;
  phase: FeudPhase;
  controllingTeam: FeudTeamKey | null;
  strikes: number;
  pot: number;
  wonBy: FeudTeamKey | null;
  questionText: string;
  answers: FeudAnswerSlotView[];
}

export interface FeudSessionView {
  id: string;
  status: "SETUP" | "IN_PROGRESS" | "FINISHED";
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  rounds: FeudRoundView[];
}
