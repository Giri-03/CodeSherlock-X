export default function MetricsStrip() {

  const metrics = [
    {
      label: "Repositories",
      value: "120+",
    },
    {
      label: "AI Analyses",
      value: "1.2K",
    },
    {
      label: "PR Reviews",
      value: "430",
    },
    {
      label: "Engineering Insights",
      value: "9.8K",
    },
  ];

  return (
    <div
      className="
      grid grid-cols-2
      lg:grid-cols-4
      gap-6
      "
    >

      {metrics.map((metric) => (

        <div
          key={metric.label}
          className="
          bg-zinc-900/70
          border border-zinc-800
          rounded-2xl
          p-6
          "
        >

          <p className="text-zinc-500">
            {metric.label}
          </p>

          <h2
            className="
            text-4xl
            font-bold
            mt-3
            "
          >
            {metric.value}
          </h2>

        </div>

      ))}

    </div>
  );
}