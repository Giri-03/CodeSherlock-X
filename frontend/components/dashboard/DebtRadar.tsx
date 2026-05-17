"use client";

import GlassCard from "@/components/ui/GlassCard";
import AIResponse from "@/components/ui/AIResponse";

interface Props {
  onAnalyze: () => void;
  result: any;
  loading?: boolean;
}

export default function DebtRadar({
  onAnalyze,
  result,
  loading
}: Props) {
  return (
    <GlassCard title="Technical Debt Radar">

      <button
        onClick={onAnalyze}
        disabled={loading}
        className="
          bg-white
          text-black
          px-6
          py-3
          rounded-xl
          font-medium
          hover:opacity-90
          transition
          disabled:opacity-50
        "
      >
        {loading
          ? "Analyzing..."
          : "Analyze Engineering Health"}
      </button>

      {result?.error && (
        <div className="mt-8 text-red-400">
          {result.error}
        </div>
      )}

      {result && !result?.error && (
        <div className="mt-8">
          <AIResponse
            content={
              typeof result === "string"
                ? result
                : result.analysis ||
                  JSON.stringify(
                    result,
                    null,
                    2
                  )
            }
          />
        </div>
      )}

    </GlassCard>
  );
}