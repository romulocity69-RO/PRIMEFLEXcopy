import { useState } from "react";
import Icon from "../Icon";
import BarChart, { LineChartMini } from "./BarChart";
import PanelModal from "./PanelModal";

const Panel = ({ title, sub, children }) => (
  <div className="rounded-2xl border border-white/8 bg-[#111013] p-4">
    <p className="text-[11px] font-bold text-white/85">{title}</p>
    {sub && <p className="mb-2 text-[9px] text-white/45">{sub}</p>}
    <div className={sub ? "" : "mt-2"}>{children}</div>
  </div>
);

const SidePanels3D = ({ data }) => {
  const [panel, setPanel] = useState(null);
  const [open, setOpen] = useState(false);
  const openPanel = (label) => {
    setPanel(label);
    setOpen(true);
  };
  return (
    <div className="grid w-full max-w-[360px] grid-cols-1 gap-3">
      {/* follow grid */}
      <Panel title={data.followTitle}>
        <div className="grid grid-cols-3 gap-2">
          {data.followItems.map((it, i) => (
            <button
              key={i}
              onClick={() => openPanel(it.label)}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-white/6 bg-[#161519] p-2.5 transition-colors hover:border-prime-pink/40"
            >
              <Icon name={it.icon} size={18} className="text-prime-pink" strokeWidth={1.6} />
              <span className="text-center text-[8px] font-medium leading-tight text-white/60">
                {it.label}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      {/* body evolution */}
      <Panel title={data.bodyTitle} sub={data.bodySub}>
        <div className="space-y-2">
          {data.body.map((b, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[10px] text-white/70">{b.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-white">{b.value}</span>
                <span
                  className={`text-[9px] font-semibold ${
                    b.delta.startsWith("-") ? "text-emerald-400" : "text-prime-pink"
                  }`}
                >
                  {b.delta}
                </span>
              </div>
            </div>
          ))}
          <button
            onClick={() => openPanel("Avaliações")}
            className="flex items-center gap-1 pt-1 text-[9px] font-semibold text-prime-pink"
          >
            Ver todas as medidas <Icon name="ChevronRight" size={11} />
          </button>
        </div>
      </Panel>

      {/* summary */}
      <Panel title={data.summaryTitle} sub={data.summarySub}>
        <div className="space-y-2">
          {data.summary.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[10px] text-white/70">{s.label}</span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-white">
                {s.value}
                {s.fire && <Icon name="Flame" size={12} className="text-prime-pink" />}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      {/* carga chart */}
      <Panel title={data.chartTitle} sub={data.chartSub}>
        <LineChartMini data={data.chart} />
        <button
          onClick={() => openPanel("Histórico de cargas")}
          className="mt-4 flex items-center gap-1 text-[9px] font-semibold text-prime-pink"
        >
          Ver gráfico completo <Icon name="ChevronRight" size={11} />
        </button>
      </Panel>

      <PanelModal label={panel} open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default SidePanels3D;
