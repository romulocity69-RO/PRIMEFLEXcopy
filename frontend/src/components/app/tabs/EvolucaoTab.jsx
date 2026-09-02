import Icon from "../../Icon";
import BarChart from "../BarChart";

const DEFAULT_CHART = [
  { label: "JAN", value: 20 },
  { label: "FEV", value: 25 },
  { label: "MAR", value: 30 },
  { label: "ABR", value: 35 },
  { label: "MAI", value: 40 },
];

const MEASURES = [
  { label: "Peso", value: "54,2 kg", delta: "-1,3 kg" },
  { label: "Cintura", value: "66 cm", delta: "-2 cm" },
  { label: "Quadril", value: "98 cm", delta: "+1 cm" },
  { label: "Coxa", value: "55 cm", delta: "-0,5 cm" },
];

const SUMMARY = [
  { label: "Treinos concluídos", value: "18/20" },
  { label: "Volume total", value: "+18%" },
  { label: "Carga média", value: "+12%" },
  { label: "Frequência", value: "100%" },
];

const EvolucaoTab = ({ plan }) => {
  const chart = plan?.chart || plan?.sidePanels?.chart || DEFAULT_CHART;
  return (
    <div className="space-y-3 px-3.5 pb-4 pt-3">
      <p className="font-display text-lg font-extrabold text-white">Sua evolução</p>

      <div className="rounded-2xl border border-white/8 bg-[#131215] p-4">
        <p className="text-[11px] font-bold text-white/85">Carga média (Hip Thrust)</p>
        <p className="mb-3 text-[9px] text-white/45">Últimos meses</p>
        <BarChart data={chart} />
      </div>

      <div className="rounded-2xl border border-white/8 bg-[#131215] p-4">
        <p className="mb-2 text-[11px] font-bold text-white/85">Evolução corporal</p>
        <div className="space-y-2">
          {MEASURES.map((b, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[11px] text-white/70">{b.label}</span>
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
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-[#131215] p-4">
        <p className="mb-2 text-[11px] font-bold text-white/85">Resumo (30 dias)</p>
        <div className="space-y-2">
          {SUMMARY.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[11px] text-white/70">{s.label}</span>
              <span className="text-[11px] font-bold text-white">{s.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/70">Dias seguidos</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-white">
              7 <Icon name="Flame" size={12} className="text-prime-pink" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvolucaoTab;
