import Icon from "../Icon";

// Simple animated bar chart used in the app screens.
const BarChart = ({ data, accent = "#ec4899", suffix = " kg", height = 90 }) => {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[8px] font-semibold text-white/60">
            {d.value}
            {suffix}
          </span>
          <div
            className="w-full rounded-t-md transition-all duration-500"
            style={{
              height: `${(d.value / max) * (height - 26)}px`,
              background: `linear-gradient(to top, ${accent}, ${accent}aa)`,
            }}
          />
          <span className="text-[8px] font-medium text-white/45">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// Line-ish chart (dots + connecting) for 3D carga graph
export const LineChartMini = ({ data, accent = "#ec4899", height = 110 }) => {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 70 - 12;
    return { x, y, ...d };
  });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <path d={path} fill="none" stroke={accent} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.6" fill={accent} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {pts.map((p, i) => (
        <span
          key={i}
          className="absolute -translate-x-1/2 text-[8px] font-semibold text-white/70"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-140%)" }}
        >
          {p.value}
        </span>
      ))}
      <div className="mt-1 flex justify-between">
        {data.map((d, i) => (
          <span key={i} className="text-[8px] font-medium text-white/45">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
