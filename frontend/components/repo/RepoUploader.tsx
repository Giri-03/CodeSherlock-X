"use client";

import { useState } from "react";

interface Props {
  onAnalyze: (url: string) => void;
}

export default function RepoUploader({
  onAnalyze,
}: Props) {
  const [url, setUrl] = useState("");

  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
      <h2 className="text-xl font-semibold mb-4">
        Analyze Repository
      </h2>

      <input
        type="text"
        placeholder="GitHub Repository URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700"
      />

      <button
        onClick={() => onAnalyze(url)}
        className="mt-4 w-full bg-white text-black py-3 rounded-xl font-medium"
      >
        Analyze Repository
      </button>
    </div>
  );
}