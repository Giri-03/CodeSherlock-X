"use client";

import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

/**
 * Sanitizes AI response content before rendering.
 * Handles cases where the backend returns:
 * - A plain markdown string (ideal)
 * - A JSON-stringified string with escaped \n characters
 * - A JSON object like { "analysis": "..." } or { "technical_debt": "..." }
 */
function sanitize(raw: string): string {
  if (!raw) return "";

  let text = raw.trim();

  // If it looks like a JSON object, try to extract the string value
  if (text.startsWith("{") || text.startsWith("[")) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "string") {
        text = parsed;
      } else if (typeof parsed === "object" && parsed !== null) {
        // Pick the first string value found
        const val = Object.values(parsed).find((v) => typeof v === "string");
        if (typeof val === "string") text = val;
      }
    } catch {
      // Not valid JSON — use as-is
    }
  }

  // Unescape literal \n and \t sequences that weren't parsed
  text = text
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");

  return text;
}

export default function AIResponse({ content }: Props) {
  return (
    <div className="ai-prose">
      <ReactMarkdown>{sanitize(content)}</ReactMarkdown>
    </div>
  );
}
