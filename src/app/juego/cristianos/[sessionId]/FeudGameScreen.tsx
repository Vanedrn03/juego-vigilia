"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FeudRoundView, FeudSessionView, FeudTeamKey } from "@/lib/feud/types";
import { TeamScoreHeader } from "@/components/feud/TeamScoreHeader";
import { FaceoffPrompt } from "@/components/feud/FaceoffPrompt";
import { Board } from "@/components/feud/Board";
import { StrikeIndicator } from "@/components/feud/StrikeIndicator";
import { FeudResultScreen } from "@/components/feud/FeudResultScreen";
import { Confetti } from "@/components/Confetti";
import { ThemeToggle } from "@/components/ThemeToggle";
import { playCelebration, playFlip, playStrike, playTick, playTimeUp, playWhoosh } from "@/lib/sound";

const TEAM_NAME_FIELD: Record<FeudTeamKey, "teamAName" | "teamBName"> = {
  TEAM_A: "teamAName",
  TEAM_B: "teamBName",
};

const TURN_SECONDS = 10;
/** Cuánto se deja el tablero visible con el último cambio antes de mostrar el resumen de la ronda. */
const REVEAL_PAUSE_MS = 1500;
const STEAL_TRANSITION_MS = 1200;

export function FeudGameScreen({ session }: { session: FeudSessionView }) {
  const router = useRouter();
  const currentRound = session.rounds.find((r) => r.phase !== "DONE");

  const currentKey = currentRound
    ? `${currentRound.id}:${currentRound.phase}:${currentRound.strikes}`
    : "none";
  const [trackedKey, setTrackedKey] = useState(currentKey);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overrideRound, setOverrideRound] = useState<FeudRoundView | null>(null);
  const [finishedRound, setFinishedRound] = useState<{
    roundNumber: number;
    wonBy: FeudTeamKey | null;
    pot: number;
  } | null>(null);
  const [turnSecondsLeft, setTurnSecondsLeft] = useState<number | null>(null);
  const autoStrikeFired = useRef(false);

  if (currentKey !== trackedKey) {
    setTrackedKey(currentKey);
    setError(null);
    setFinishedRound(null);
    setOverrideRound(null);
  }

  const displayRound = overrideRound ?? currentRound;
  const revealedCount = displayRound?.answers.filter((a) => a.revealed).length ?? 0;
  const turnKey = displayRound
    ? `${displayRound.id}:${displayRound.phase}:${displayRound.strikes}:${revealedCount}`
    : "none";
  const timerActive =
    !!displayRound &&
    (displayRound.phase === "PLAYING" || displayRound.phase === "STEAL") &&
    !finishedRound &&
    !pending;

  useEffect(() => {
    autoStrikeFired.current = false;
    setTurnSecondsLeft(timerActive ? TURN_SECONDS : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnKey, timerActive]);

  useEffect(() => {
    if (turnSecondsLeft === null) return;
    if (turnSecondsLeft <= 0) {
      if (!autoStrikeFired.current) {
        autoStrikeFired.current = true;
        playTimeUp();
        void handleStrike();
      }
      return;
    }
    if (turnSecondsLeft <= 5) playTick();
    const t = setTimeout(() => {
      setTurnSecondsLeft((s) => (s !== null ? s - 1 : null));
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnSecondsLeft]);

  if (!currentRound) {
    return (
      <div className="relative min-h-screen bg-gradient-to-b from-amber-50 dark:from-slate-950 via-white dark:via-slate-950 to-white dark:to-blue-950 p-6 text-slate-900 dark:text-slate-100">
        <ThemeToggle className="fixed right-4 top-4 z-10" />
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
      const data = await callApi("faceoff", { roundId: currentRound.id, team });
      setOverrideRound(data.round as FeudRoundView);
      playWhoosh();
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
      const updatedRound = data.round as FeudRoundView;
      setOverrideRound(updatedRound);
      playFlip();
      if (updatedRound.phase === "DONE") {
        setTimeout(() => {
          setFinishedRound({
            roundNumber: currentRound.roundNumber,
            wonBy: updatedRound.wonBy,
            pot: updatedRound.pot,
          });
          if (updatedRound.wonBy) playCelebration();
          setPending(false);
        }, REVEAL_PAUSE_MS);
      } else {
        router.refresh();
        setPending(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al revelar la respuesta");
      setPending(false);
    }
  }

  async function handleStrike() {
    if (pending || !currentRound) return;
    setPending(true);
    setError(null);
    try {
      const data = await callApi("strike", { roundId: currentRound.id });
      const updatedRound = data.round as FeudRoundView;
      setOverrideRound(updatedRound);
      playStrike();
      if (updatedRound.phase === "DONE") {
        setTimeout(() => {
          setFinishedRound({
            roundNumber: currentRound.roundNumber,
            wonBy: updatedRound.wonBy,
            pot: updatedRound.pot,
          });
          if (updatedRound.wonBy) playCelebration();
          setPending(false);
        }, REVEAL_PAUSE_MS);
      } else if (updatedRound.phase === "STEAL") {
        setTimeout(() => {
          router.refresh();
          setPending(false);
        }, STEAL_TRANSITION_MS);
      } else {
        router.refresh();
        setPending(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al marcar el strike");
      setPending(false);
    }
  }

  function handleContinue() {
    setFinishedRound(null);
    setOverrideRound(null);
    router.refresh();
  }

  const controllingTeamName = displayRound?.controllingTeam
    ? session[TEAM_NAME_FIELD[displayRound.controllingTeam]]
    : null;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50 dark:from-slate-950 via-white dark:via-slate-950 to-white dark:to-blue-950 p-6 text-slate-900 dark:text-slate-100">
      <ThemeToggle className="fixed right-4 top-4 z-10" />
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <TeamScoreHeader
          teamAName={session.teamAName}
          teamBName={session.teamBName}
          teamAScore={session.teamAScore}
          teamBScore={session.teamBScore}
          controllingTeam={currentRound.controllingTeam}
        />

        <p className="text-sm text-slate-500 dark:text-slate-400">Ronda {currentRound.roundNumber}</p>

        {finishedRound ? (
          <div className="relative animate-[pop-in_0.35s_ease-out,celebrate-glow_1.8s_ease-in-out_infinite] space-y-4 overflow-hidden rounded-xl border border-amber-500/20 bg-white p-6 dark:bg-slate-900/80 text-center shadow-xl">
            {finishedRound.wonBy && <Confetti />}
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Ronda {finishedRound.roundNumber} terminada
            </p>
            <p className="text-xl text-slate-700 dark:text-slate-300">
              {finishedRound.wonBy
                ? `¡${session[TEAM_NAME_FIELD[finishedRound.wonBy]]} se lleva ${finishedRound.pot} puntos! 🎉`
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
            {displayRound?.phase === "FACEOFF" && (
              <FaceoffPrompt
                questionText={displayRound.questionText}
                teamAName={session.teamAName}
                teamBName={session.teamBName}
                disabled={pending}
                onAssign={handleAssign}
              />
            )}

            {displayRound && (displayRound.phase === "PLAYING" || displayRound.phase === "STEAL") && (
              <div
                key={displayRound.id}
                className="animate-[fadein_0.4s_ease-out] space-y-5 rounded-xl border border-amber-500/20 bg-white p-6 dark:bg-slate-900/80 shadow-xl"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                      {displayRound.phase === "STEAL"
                        ? `Robo — el otro equipo tiene un intento`
                        : `${controllingTeamName} tiene el control`}
                    </p>
                    <h1 className="text-3xl font-bold lg:text-4xl">{displayRound.questionText}</h1>
                  </div>

                  {turnSecondsLeft !== null && (
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 font-mono text-2xl font-bold ${
                        turnSecondsLeft <= 5
                          ? "border-red-500 text-red-600 dark:text-red-400 [animation:timer-pulse_1s_ease-in-out_infinite]"
                          : "border-amber-400 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {turnSecondsLeft}
                    </div>
                  )}
                </div>

                <Board answers={displayRound.answers} disabled={pending} onReveal={handleReveal} />

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <StrikeIndicator strikes={displayRound.strikes} />
                  <button
                    type="button"
                    disabled={pending}
                    onClick={handleStrike}
                    className="rounded border border-red-500 px-5 py-2 font-semibold text-red-600 dark:text-red-400 hover:bg-red-700 hover:text-white disabled:opacity-40"
                  >
                    Marcar strike
                  </button>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Bote de la ronda: <span className="font-mono text-amber-700 dark:text-amber-300">{displayRound.pot}</span>
                </p>
              </div>
            )}
          </>
        )}

        {error && (
          <p className="rounded border border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-950/40 p-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
