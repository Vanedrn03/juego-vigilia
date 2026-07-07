"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FeudSessionView, FeudTeamKey } from "@/lib/feud/types";
import { TeamScoreHeader } from "@/components/feud/TeamScoreHeader";
import { FaceoffPrompt } from "@/components/feud/FaceoffPrompt";
import { Board } from "@/components/feud/Board";
import { StrikeIndicator } from "@/components/feud/StrikeIndicator";
import { FeudResultScreen } from "@/components/feud/FeudResultScreen";

const TEAM_NAME_FIELD: Record<FeudTeamKey, "teamAName" | "teamBName"> = {
  TEAM_A: "teamAName",
  TEAM_B: "teamBName",
};

export function FeudGameScreen({ session }: { session: FeudSessionView }) {
  const router = useRouter();
  const currentRound = session.rounds.find((r) => r.phase !== "DONE");

  const currentKey = currentRound
    ? `${currentRound.id}:${currentRound.phase}:${currentRound.strikes}`
    : "none";
  const [trackedKey, setTrackedKey] = useState(currentKey);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finishedRound, setFinishedRound] = useState<{
    roundNumber: number;
    wonBy: FeudTeamKey | null;
    pot: number;
  } | null>(null);

  if (currentKey !== trackedKey) {
    setTrackedKey(currentKey);
    setError(null);
    setFinishedRound(null);
  }

  if (!currentRound) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-blue-950 p-6 text-slate-100">
        <FeudResultScreen
          teamAName={session.teamAName}
          teamBName={session.teamBName}
          teamAScore={session.teamAScore}
          teamBScore={session.teamBScore}
        />
      </div>
    );
  }

  async function callApi(path: string, body: object) {
    const res = await fetch(`/api/feud/${session.id}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Ocurrió un error");
    return data;
  }

  async function handleAssign(team: FeudTeamKey) {
    if (pending || !currentRound) return;
    setPending(true);
    setError(null);
    try {
      await callApi("faceoff", { roundId: currentRound.id, team });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al asignar el control");
    } finally {
      setPending(false);
    }
  }

  async function handleReveal(answerId: string) {
    if (pending || !currentRound) return;
    setPending(true);
    setError(null);
    try {
      const data = await callApi("reveal", { roundId: currentRound.id, answerId });
      if (data.round.phase === "DONE") {
        setFinishedRound({
          roundNumber: currentRound.roundNumber,
          wonBy: data.round.wonBy,
          pot: data.round.pot,
        });
      } else {
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al revelar la respuesta");
    } finally {
      setPending(false);
    }
  }

  async function handleStrike() {
    if (pending || !currentRound) return;
    setPending(true);
    setError(null);
    try {
      const data = await callApi("strike", { roundId: currentRound.id });
      if (data.round.phase === "DONE") {
        setFinishedRound({
          roundNumber: currentRound.roundNumber,
          wonBy: data.round.wonBy,
          pot: data.round.pot,
        });
      } else {
        router.refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al marcar el strike");
    } finally {
      setPending(false);
    }
  }

  function handleContinue() {
    setFinishedRound(null);
    router.refresh();
  }

  const controllingTeamName = currentRound.controllingTeam
    ? session[TEAM_NAME_FIELD[currentRound.controllingTeam]]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-blue-950 p-6 text-slate-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <TeamScoreHeader
          teamAName={session.teamAName}
          teamBName={session.teamBName}
          teamAScore={session.teamAScore}
          teamBScore={session.teamBScore}
          controllingTeam={currentRound.controllingTeam}
        />

        <p className="text-sm text-slate-500">Ronda {currentRound.roundNumber}</p>

        {finishedRound ? (
          <div className="space-y-4 rounded-xl border border-amber-500/20 bg-slate-900/80 p-6 text-center shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Ronda {finishedRound.roundNumber} terminada
            </p>
            <p className="text-lg text-slate-300">
              {finishedRound.wonBy
                ? `${session[TEAM_NAME_FIELD[finishedRound.wonBy]]} se lleva ${finishedRound.pot} puntos`
                : "Ronda terminada"}
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className="rounded bg-amber-500 px-5 py-2 font-semibold text-slate-950 hover:bg-amber-400"
            >
              Siguiente ronda
            </button>
          </div>
        ) : (
          <>
        {currentRound.phase === "FACEOFF" && (
          <FaceoffPrompt
            questionText={currentRound.questionText}
            teamAName={session.teamAName}
            teamBName={session.teamBName}
            disabled={pending}
            onAssign={handleAssign}
          />
        )}

        {(currentRound.phase === "PLAYING" || currentRound.phase === "STEAL") && (
          <div
            key={currentRound.id}
            className="animate-[fadein_0.4s_ease-out] space-y-5 rounded-xl border border-amber-500/20 bg-slate-900/80 p-6 shadow-xl"
          >
            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-amber-400">
                {currentRound.phase === "STEAL"
                  ? `Robo — el otro equipo tiene un intento`
                  : `${controllingTeamName} tiene el control`}
              </p>
              <h1 className="text-2xl font-bold lg:text-3xl">{currentRound.questionText}</h1>
            </div>

            <Board answers={currentRound.answers} disabled={pending} onReveal={handleReveal} />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <StrikeIndicator strikes={currentRound.strikes} />
              <button
                type="button"
                disabled={pending}
                onClick={handleStrike}
                className="rounded border border-red-500 px-5 py-2 font-semibold text-red-400 hover:bg-red-700 hover:text-white disabled:opacity-40"
              >
                Marcar strike
              </button>
            </div>

            <p className="text-sm text-slate-400">
              Bote de la ronda: <span className="font-mono text-amber-300">{currentRound.pot}</span>
            </p>
          </div>
        )}

        {currentRound.phase === "DONE" && (
          <div className="space-y-4 rounded-xl border border-amber-500/20 bg-slate-900/80 p-6 text-center shadow-xl">
            <p className="text-lg text-slate-300">
              {currentRound.wonBy
                ? `${session[TEAM_NAME_FIELD[currentRound.wonBy]]} se lleva ${currentRound.pot} puntos`
                : "Ronda terminada"}
            </p>
            <button
              type="button"
              onClick={handleContinue}
              className="rounded bg-amber-500 px-5 py-2 font-semibold text-slate-950 hover:bg-amber-400"
            >
              Siguiente ronda
            </button>
          </div>
        )}
          </>
        )}

        {error && (
          <p className="rounded border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
