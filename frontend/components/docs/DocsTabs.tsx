"use client";

import { useState } from "react";

import GlassCard from "@/components/ui/GlassCard";
import AIResponse from "@/components/ui/AIResponse";

interface Props {
  onGenerate: (
    type: string
  ) => void;

  result: any;
  loading?: boolean;
}

const docTypes = [
  "README",
  "Architecture",
  "Onboarding",
  "API Documentation",
];

export default function DocsTabs({
  onGenerate,
  result,
  loading
}: Props) {
  const [selected, setSelected] =
    useState("README");

  return (
    <GlassCard title="Documentation Forge">

      <div className="flex flex-wrap gap-3 mb-6">
        {docTypes.map((type) => (
          <button
            key={type}
            onClick={() =>
              setSelected(type)
            }
            className={`
              px-4
              py-2
              rounded-xl
              border
              transition
              ${
                selected === type
                  ? "bg-white text-black"
                  : "border-zinc-700 text-white"
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>

      <button
        onClick={() =>
          onGenerate(selected)
        }
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
          ? "Generating..."
          : "Generate Documentation"}
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
                : result.documentation ||
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