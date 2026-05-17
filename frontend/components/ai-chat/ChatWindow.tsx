"use client";

import { useState } from "react";

import AIResponse from "@/components/ui/AIResponse";
import GlassCard from "@/components/ui/GlassCard";

interface Props {
  onAsk: (question: string) => void;
  answer: any;
  loading?: boolean;
}

export default function ChatWindow({
  onAsk,
  answer,
  loading
}: Props) {
  const [question, setQuestion] =
    useState("");

  return (
    <GlassCard title="Ask Your Repository">

      <textarea
        placeholder="Ask repository questions..."
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
        className="
          w-full
          p-4
          rounded-xl
          bg-zinc-800
          border
          border-zinc-700
          min-h-[120px]
          text-white
        "
      />

      <button
        onClick={() => onAsk(question)}
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
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer?.error && (
        <div className="mt-6 text-red-400">
          {answer.error}
        </div>
      )}

      {answer && !answer?.error && (
        <div className="mt-6">
          <AIResponse
            content={
              typeof answer === "string"
                ? answer
                : answer.answer ||
                  JSON.stringify(
                    answer,
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