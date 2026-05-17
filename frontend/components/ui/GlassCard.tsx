import { motion } from "framer-motion";

interface Props {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ title, children, className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-2xl border border-white/[0.07] bg-[#0d1017] overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-[#f0f4ff]">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}
