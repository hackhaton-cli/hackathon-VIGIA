import { RiskLevel } from "../data/patients";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
}

const config = {
  alto: {
    label: "Alto Risco",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
  medio: {
    label: "Médio Risco",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  baixo: {
    label: "Baixo Risco",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
  },
};

export function RiskBadge({ level, size = "sm" }: RiskBadgeProps) {
  const c = config[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ${c.bg} ${c.text} ${c.border} ${size === "md" ? "text-sm" : "text-xs"}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
