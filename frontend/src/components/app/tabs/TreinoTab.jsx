import Icon from "../../Icon";
import { weekDays, TRAINER_IMG } from "../../../mock";

const WeekRow = () => (
  <div className="flex justify-between gap-1 px-3.5 pb-1 pt-2">
    {weekDays.map((d, i) => (
      <div
        key={i}
        className={`flex flex-1 flex-col items-center rounded-xl py-1.5 ${
          d.active ? "bg-gradient-to-b from-prime-pink to-prime-pinkdeep text-white" : "text-white/55"
        }`}
      >
        <span className="text-[8px] font-bold tracking-wide">{d.day}</span>
        <span className="text-xs font-bold">{d.date}</span>
      </div>
    ))}
  </div>
);

const ExerciseItem = ({ ex, index, planId, done, onToggle, onOpen }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#131215] p-2.5 transition-colors hover:border-prime-pink/30">
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-prime-pink/15 text-[10px] font-bold text-prime-pink">
      {index + 1}
    </span>
    <button onClick={() => onOpen(ex)} className="relative shrink-0">
      <img src={ex.img} alt={ex.name} className="h-12 w-12 rounded-lg object-cover" />
      <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30">
        <Icon name="Play" size={14} className="fill-white text-white" />
      </span>
    </button>
    <button onClick={() => onOpen(ex)} className="min-w-0 flex-1 text-left">
      <div className="flex flex-wrap items-center gap-1.5">
        <p className="text-[13px] font-bold text-white">{ex.name}</p>
        {ex.tag && index === 0 && (
          <span className="rounded bg-prime-pink/15 px-1.5 py-0.5 text-[8px] font-bold text-prime-pink">
            {ex.tag}
          </span>
        )}
      </div>
      <p className="text-[9px] text-white/50">
        {ex.sets} · {ex.reps} · {ex.rest}
      </p>
      {planId === "2.0" && (
        <p className="text-[9px] text-white/60">Carga sugerida: {ex.suggested}</p>
      )}
      {planId === "3d" && (
        <p className="text-[9px] text-white/60">
          Carga anterior: {ex.prev} ·{" "}
          <span className="font-semibold text-prime-pink">Carga atual: {ex.current}</span>
        </p>
      )}
    </button>
    {planId === "start" ? (
      <Icon name="ChevronRight" size={16} className="shrink-0 text-white/40" />
    ) : (
      <button onClick={() => onToggle(ex.id)} className="shrink-0">
        <Icon
          name="CheckCircle2"
          size={20}
          className={done ? "text-prime-pink" : "text-white/25"}
        />
      </button>
    )}
  </div>
);

const TreinoTab = ({ planId, plan, exercises, done, onToggle, onOpen, onAdd, onStart, onFlex }) => {
  return (
    <>
      <WeekRow />
      <div className="space-y-3 px-3.5 pb-4 pt-2">
        {planId === "start" && (
          <div className="rounded-2xl border border-white/8 bg-[#131215] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-prime-pink">{plan.workoutTitle}</p>
                <p className="text-base font-extrabold text-white">{plan.workoutName}</p>
              </div>
              <Icon name="Apple" size={22} className="text-prime-pink" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { l: "Duração média", v: plan.duration },
                { l: "Nível", v: plan.level },
                { l: "Frequência", v: plan.frequency },
              ].map((s, i) => (
                <div key={i} className="rounded-lg bg-black/30 p-2 text-center">
                  <p className="text-[8px] text-white/45">{s.l}</p>
                  <p className="text-[10px] font-bold text-white">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {planId === "2.0" && (
          <div className="rounded-2xl border border-white/8 bg-[#131215] p-3">
            <div className="flex items-center gap-3">
              <img src={TRAINER_IMG} alt="personal" className="h-10 w-10 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-[11px] font-bold text-prime-pink">{plan.personalNote}</p>
                <p className="text-[9px] text-white/55">{plan.personalObjective}</p>
                <p className="text-[9px] text-white/45">{plan.personalLevel}</p>
              </div>
            </div>
          </div>
        )}

        {planId === "3d" && (
          <>
            <div className="rounded-2xl border border-white/8 bg-[#131215] p-3">
              <div className="flex items-center gap-3">
                <img src={TRAINER_IMG} alt="personal" className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-prime-pink">{plan.personalRole}</p>
                  <p className="text-sm font-extrabold text-white">{plan.personalName}</p>
                  <p className="text-[9px] text-white/45">{plan.nextEval}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-prime-pink/25 bg-prime-pink/10 p-3">
              <p className="pr-2 text-[10px] font-medium leading-snug text-prime-pinklight">{plan.focus}</p>
              <Icon name="ChevronDown" size={16} className="shrink-0 text-prime-pink" />
            </div>
          </>
        )}

        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] font-bold text-white/85">
            {planId === "start" ? "Exercícios" : `${plan.workoutTitle} - ${plan.workoutName}`}
          </p>
          <span className="text-[9px] text-white/45">{exercises.length} exercícios</span>
        </div>

        <div className="space-y-2">
          {exercises.map((ex, i) => (
            <ExerciseItem
              key={ex.id}
              ex={ex}
              index={i}
              planId={planId}
              done={!!done[ex.id]}
              onToggle={onToggle}
              onOpen={onOpen}
            />
          ))}
        </div>

        {planId === "2.0" && (
          <button
            onClick={onAdd}
            className="w-full rounded-xl border border-dashed border-prime-pink/40 py-2.5 text-[11px] font-semibold text-prime-pink transition-colors hover:bg-prime-pink/5"
          >
            + Adicionar exercício
          </button>
        )}

        <button
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white transition-transform hover:scale-[1.02]"
        >
          <Icon name="Play" size={16} className="fill-white" />
          Iniciar treino
        </button>

        <button
          onClick={onFlex}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-prime-gold/40 py-2.5 text-xs font-bold text-prime-gold transition-colors hover:bg-prime-gold/5"
        >
          <Icon name="Sparkles" size={14} />
          Pausar com Prime Flex
        </button>
      </div>
    </>
  );
};

export default TreinoTab;
