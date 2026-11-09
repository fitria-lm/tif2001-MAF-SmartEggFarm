const COLORS = {
  green: {
    solid: "bg-[#3E7642] border-[#3E7642] text-white",
    outline: "bg-white border-[#3E7642] text-[#3E7642]",
  },
  orange: {
    solid: "bg-[#CD7E23] border-[#CD7E23] text-white",
    outline: "bg-white border-[#CD7E23] text-[#CD7E23]",
  },
};

const SIZES = {
  lg: {
    box: "rounded-3xl p-5",
    label: "text-sm font-semibold uppercase",
    sub: "text-base",
    value: "text-2xl md:text-3xl font-bold",
  },
  md: {
    box: "rounded-2xl p-4",
    label: "text-sm font-medium",
    sub: "text-sm",
    value: "text-lg font-semibold",
  },
  sm: {
    box: "rounded-xl p-3",
    label: "text-xs font-medium",
    sub: "text-xs",
    value: "text-base font-semibold",
  },
};

export default function StatCard({
  label,
  sublabel,
  value,
  color = "green", // "green" | "orange"
  variant = "solid", // "solid" | "outline"
  size = "md", // "lg" | "md" | "sm"
}) {
  const s = SIZES[size];
  return (
    <div className={`border ${COLORS[color][variant]} ${s.box}`}>
      <p className={s.label}>{label}</p>
      {sublabel && <p className={s.sub}>{sublabel}</p>}
      <p className={`mt-1 ${s.value}`}>{value}</p>
    </div>
  );
}