"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer
} from "recharts";

const data = [
  {
    subject: "Maintainability",
    score: 7,
  },
  {
    subject: "Scalability",
    score: 6,
  },
  {
    subject: "Security",
    score: 8,
  },
  {
    subject: "Complexity",
    score: 5,
  },
  {
    subject: "Architecture",
    score: 7,
  },
];

export default function RiskChart() {
  return (
    <div className="w-full h-[350px]">

      <ResponsiveContainer>
        <RadarChart data={data}>

          <PolarGrid />

          <PolarAngleAxis
            dataKey="subject"
          />

          <Radar
            dataKey="score"
          />

        </RadarChart>
      </ResponsiveContainer>

    </div>
  );
}