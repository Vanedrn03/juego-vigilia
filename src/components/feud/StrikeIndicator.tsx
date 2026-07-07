export function StrikeIndicator({ strikes }: { strikes: number }) {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`flex h-12 w-12 items-center justify-center rounded-lg border text-2xl font-bold ${
            i < strikes
              ? "border-red-500 bg-red-700 text-white"
              : "border-slate-700 bg-slate-900 text-slate-700"
          }`}
        >
          X
        </div>
      ))}
    </div>
  );
}
