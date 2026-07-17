"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { GameSessionView, PrizeLevelView } from "@/lib/game/types";
import { PrizeLadder } from "@/components/game/PrizeLadder";
import { OptionButton } from "@/components/game/OptionButton";
import { LifelineBar } from "@/components/game/LifelineBar";
import { ResultScreen } from "@/components/game/ResultScreen";
import { Confetti } from "@/components/Confetti";
import { playCelebration, playCorrect, playStrike, playTick, playWhoosh } from "@/lib/sound";

type RevealResult = {
  isCorrect: boolean;
  correctOption: "A" | "B" | "C" | "D";
  outcome: "ADVANCE" | "WON" | "LOST";
};

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export function GameScreen({
  session,
  prizeLevels,
}: {
  session: GameSessionView;
  prizeLevels: PrizeLevelView[];
}) {
  const router = useRouter();
  const activeParticipant = session.participants.find((p) => p.status === "ACTIVE");
  const currentSQ = activeParticipant
    ? activeParticipant.sessionQuestions[activeParticipant.sessionQuestions.length - 1]
    : undefined;

  const currentKey = activeParticipant
    ? `${activeParticipant.id}:${activeParticipant.currentStep}`
    : "none";

  const [trackedKey, setTrackedKey] = useState(currentKey);
  const [selectedOption, setSelectedOption] = useState<null | "A" | "B" | "C" | "D">(null);
  const [revealResult, setRevealResult] = useState<RevealResult | null>(null);
  const [localFiftyOptions, setLocalFiftyOptions] = useState<string[] | null>(
    currentSQ?.revealedFiftyOptions ?? null
  );
  const [leaderPanelOpen, setLeaderPanelOpen] = useState(false);
  const [teamTimer, setTeamTimer] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (currentKey !== trackedKey) {
    setTrackedKey(currentKey);
    setSelectedOption(null);
    setRevealResult(null);
    setLocalFiftyOptions(currentSQ?.revealedFiftyOptions ?? null);
    setLeaderPanelOpen(false);
    setTeamTimer(null);
    setError(null);
  }

  useEffect(() => {
    if (teamTimer === null) return;
    if (teamTimer <= 0) return;
    if (teamTimer <= 5) playTick();
    const t = setTimeout(() => setTeamTimer((s) => (s !== null ? s - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [teamTimer]);

  if (!activeParticipant || !currentSQ) {
    return <ResultScreen participants={session.participants} />;
  }

  const participant = activeParticipant;

  async function callApi(path: string, body: object) {
    const res = await fetch(`/api/sesiones/${session.id}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Ocurrió un error");
    return data;
  }

  async function handleConfirm() {
    if (!selectedOption || pending) return;
    setPending(true);
    setError(null);
    try {
      const data = await callApi("answer", {
        participantId: participant.id,
        optionKey: selectedOption,
      });
      setRevealResult({
        isCorrect: data.isCorrect,
        correctOption: data.correctOption,
        outcome: data.outcome,
      });
      if (data.isCorrect) {
        if (data.outcome === "WON") playCelebration();
        else playCorrect();
      } else {
        playStrike();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar la respuesta");
    } finally {
      setPending(false);
    }
  }

  function handleContinue() {
    playWhoosh();
    router.refresh();
  }

  async function handleWalkAway() {
    if (pending) return;
    const ok = window.confirm(
      `¿${participant.name} quiere retirarse con ${participant.score.toLocaleString("es")} puntos?`
    );
    if (!ok) return;
    setPending(true);
    try {
      await callApi("walk-away", { participantId: participant.id });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al retirarse");
    } finally {
      setPending(false);
    }
  }

  async function handleLifeline(lifeline: "FIFTY" | "LEADER" | "TEAM") {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const data = await callApi("lifeline", { participantId: participant.id, lifeline });
      if (lifeline === "FIFTY") {
        setLocalFiftyOptions(data.revealedFiftyOptions);
      }
      if (lifeline === "LEADER") {
        setLeaderPanelOpen(true);
      }
      if (lifeline === "TEAM") {
        setTeamTimer(30);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al usar el comodín");
    } finally {
      setPending(false);
    }
  }

  const q = currentSQ.question;
  const optionsDisabled = pending || revealResult !== null;

  function revealStateFor(key: "A" | "B" | "C" | "D") {
    if (!revealResult) return "none" as const;
    if (key === revealResult.correctOption) return "correct" as const;
    if (key === selectedOption) return "incorrect" as const;
    return "dimmed" as const;
  }

  function isHidden(key: "A" | "B" | "C" | "D") {
    if (!localFiftyOptions) return false;
    return !localFiftyOptions.includes(key);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-amber-50 via-white to-white p-6 text-slate-900">
      {revealResult?.outcome === "WON" && <Confetti count={40} />}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap gap-3">
            {session.participants.map((p) => (
              <div
                key={p.id}
                className={`rounded-lg border px-4 py-2 transition ${
                  p.id === activeParticipant.id
                    ? "border-amber-400 bg-amber-500/10 shadow-[0_0_20px_-4px_rgba(245,158,11,0.5)]"
                    : "border-slate-200 bg-slate-100"
                }`}
              >
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-slate-500">
                  {p.score.toLocaleString("es")} pts · {p.status}
                </p>
              </div>
            ))}
          </div>

          <div
            key={currentSQ.id}
            className="animate-[fadein_0.4s_ease-out] rounded-xl border border-amber-500/20 bg-white p-6 shadow-xl"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-600">
              Nivel {currentSQ.step} · {activeParticipant.name}
            </p>
            <h1 className="text-4xl font-bold leading-snug lg:text-5xl">{q.text}</h1>
            {q.verseRef && (
              <p className="mt-2 text-sm text-slate-500">Referencia: {q.verseRef}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {OPTION_KEYS.map((key) => (
              <OptionButton
                key={key}
                optionKey={key}
                text={q[`option${key}` as "optionA"]}
                disabled={optionsDisabled || isHidden(key)}
                hidden={isHidden(key)}
                selected={selectedOption === key}
                revealState={revealStateFor(key)}
                onClick={() => setSelectedOption(key)}
              />
            ))}
          </div>

          <LifelineBar
            fiftyUsed={activeParticipant.lifelineFiftyUsed}
            leaderUsed={activeParticipant.lifelineLeaderUsed}
            teamUsed={activeParticipant.lifelineTeamUsed}
            disabled={optionsDisabled}
            onUseFifty={() => handleLifeline("FIFTY")}
            onUseLeader={() => handleLifeline("LEADER")}
            onUseTeam={() => handleLifeline("TEAM")}
          />

          {leaderPanelOpen && (
            <div className="rounded-lg border border-amber-500/40 bg-slate-100 p-4 text-sm text-amber-900">
              Un líder en la sala puede dar su opinión en voz alta antes de responder.
            </div>
          )}

          {teamTimer !== null && teamTimer > 0 && (
            <div className="rounded-lg border border-amber-500/40 bg-slate-100 p-4 text-center text-4xl font-mono text-amber-700">
              {teamTimer}s para consultar con el equipo
            </div>
          )}

          {error && (
            <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {!revealResult && (
              <>
                <button
                  type="button"
                  disabled={!selectedOption || pending}
                  onClick={handleConfirm}
                  className="rounded bg-amber-500 px-5 py-2 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-40"
                >
                  {pending ? "Enviando..." : "Confirmar respuesta"}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={handleWalkAway}
                  className="rounded border border-slate-300 px-5 py-2 hover:border-amber-400 disabled:opacity-40"
                >
                  Retirarse con el puntaje actual
                </button>
              </>
            )}
            {revealResult && (
              <button
                type="button"
                onClick={handleContinue}
                className="rounded bg-amber-500 px-5 py-2 font-semibold text-slate-950 hover:bg-amber-400"
              >
                {revealResult.outcome === "LOST"
                  ? "Ver resultado"
                  : revealResult.outcome === "WON"
                    ? "¡Ganó la Corona de Vida! Continuar"
                    : "Siguiente pregunta"}
              </button>
            )}
          </div>
        </div>

        <div className="lg:w-64">
          <PrizeLadder levels={prizeLevels} currentStep={activeParticipant.currentStep} />
        </div>
      </div>
    </div>
  );
}
