export default function LoadingSpinner({ label = "AI is analyzing..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 spin" />
        <div className="absolute inset-2 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-indigo-400 pulse-dot" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-[#c8d0e8]">{label}</p>
        <p className="text-xs text-[#4a5568] mt-1">Powered by IBM Bob AI</p>
      </div>
    </div>
  );
}
