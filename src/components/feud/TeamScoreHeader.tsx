import type { FeudTeamKey } from "@/lib/feud/types";

export function TeamScoreHeader({
  teamAName,
  teamBName,
  teamAScore,
  teamBScore,
  controllingTeam,
}: {
  teamAName: string;
  teamBName: string;
  teamAScore: number;
  teamBScore: number;
  controllingTeam: FeudTeamKey | null;
}) {
  const teams: { key: FeudTeamKey; name: string; score: number }[] = [
    { key: "TEAM_A", name: teamAName, score: teamAScore },
    { key: "TEAM_B", name: teamBName, score: teamBScore },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {teams.map((t) => (
        <div
          key={t.key}
          className={`rounded-lg border px-5 py-3 transition ${
            controllingTeam === t.key
              ? "border-amber-400 bg-amber-500/10 shadow-[0_0_20px_-4px_rgba(245,158,11,0.5)]"
              : "border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
          }`}
        >
          <p className="text-xl font-bold">{t.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.score.toLocaleString("es")} pts</p>
        </div>
      ))}
    </div>
  );
}
