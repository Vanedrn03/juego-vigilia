export function StrikeIndicator({ strikes }: { strikes: number }) {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`flex h-14 w-14 items-center justify-center rounded-lg border text-3xl font-bold ${
            i < strikes
              ? "animate-[strike-shake_0.4s_ease-out] border-red-500 bg-red-700 text-white"
              : "border-slate-300 bg-slate-100 text-slate-700"
          }`}
        >
          X
        </div>
      ))}
    </div>
  );
}
