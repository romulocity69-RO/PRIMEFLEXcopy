import Icon from "../../Icon";
import { inicioSummary } from "../../../mock";

const InicioTab = ({ onGoTreino }) => {
  const s = inicioSummary;
  return (
    <div className="space-y-3 px-3.5 pb-4 pt-3">
      <div>
        <p className="font-display text-lg font-extrabold text-white">{s.greeting}</p>
        <p className="text-[11px] text-white/55">{s.sub}</p>
      </div>

      {/* today card */}
      <div className="rounded-2xl border border-prime-pink/25 bg-gradient-to-b from-[#1a1016] to-[#0f0d0e] p-4">
        <p className="text-[10px] font-bold tracking-wide text-prime-pink">{s.todayTitle}</p>
        <p className="mt-0.5 text-sm font-extrabold text-white">{s.todayName}</p>
        <p className="text-[10px] text-white/50">{s.todayMeta}</p>
        <button
          onClick={onGoTreino}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-2.5 text-xs font-bold text-white"
        >
          <Icon name="Play" size={14} className="fill-white" /> Ir para o treino
        </button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-2">
        {s.stats.map((st, i) => (
          <div key={i} className="rounded-xl border border-white/8 bg-[#131215] p-3 text-center">
            <Icon name={st.icon} size={16} className="mx-auto text-prime-pink" />
            <p className="mt-1 text-xs font-extrabold text-white">{st.value}</p>
            <p className="text-[8px] text-white/45">{st.label}</p>
          </div>
        ))}
      </div>

      {/* week plan */}
      <div className="rounded-2xl border border-white/8 bg-[#131215] p-4">
        <p className="mb-2 text-[11px] font-bold text-white/85">Sua semana</p>
        <div className="space-y-2">
          {s.weekPlan.map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-9 items-center justify-center rounded-lg text-[9px] font-bold ${
                  w.today ? "bg-prime-pink text-white" : "bg-black/40 text-white/50"
                }`}
              >
                {w.day}
              </span>
              <p className="flex-1 text-[11px] text-white/75">{w.name}</p>
              {w.today && <span className="text-[9px] font-bold text-prime-pink">Hoje</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InicioTab;
