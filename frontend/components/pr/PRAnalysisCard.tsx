"use client";

import { useState } from "react";

import AIResponse from "@/components/ui/AIResponse";
import GlassCard from "@/components/ui/GlassCard";

interface Props {
  onAnalyze: (url: string) => void;
  result: any;
  loading?: boolean;
}

export default function PRAnalysisCard({
  onAnalyze,
  result,
  loading
}: Props) {
  const [url, setUrl] = useState("");

  return (
    <GlassCard title="PR Impact Analyzer">

      <input
        type="text"
        placeholder="https://github.com/pallets/flask/pull/5735"
        value={url}
        onChange={(e) =>
          setUrl(e.target.value)
        }
        className="
          w-full
          p-3
          rounded-xl
          bg-zinc-800
          border
          border-zinc-700
          text-white
        "
      />

      <button
        onClick={() => onAnalyze(url)}
        disabled={loading}
        className="
          mt-4
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
        {loading ? "Analyzing..." : "Analyze PR"}
      </button>

      {result?.error && (
        <div className="mt-6 text-red-400">
          {result.error}
        </div>
      )}

      {result?.analysis && (
        <div className="mt-6">
          <AIResponse
            content={result.analysis}
          />
        </div>
      )}

    </GlassCard>
  );
}