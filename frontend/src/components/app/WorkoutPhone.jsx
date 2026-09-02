import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon";
import { weekDays, bottomNav, TRAINER_IMG } from "../../mock";
import { useToast } from "../../hooks/use-toast";

const StatusBar = () => (
  <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-medium text-white/80">
    <span>09:41</span>
    <div className="flex items-center gap-1">
      <Icon name="SignalHigh" size={13} />
      <Icon name="Wifi" size={13} />
      <Icon name="BatteryFull" size={15} />
    </div>
  </div>
);

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

const ExerciseItem = ({ ex, index, planId, done, onToggle }) => (
  <div className="flex items-center gap-3 rounded-xl border border-white/6 bg-[#131215] p-2.5">
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-prime-pink/15 text-[10px] font-bold text-prime-pink">
      {index + 1}
    </span>
    <img src={ex.img} alt={ex.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
    <div className="min-w-0 flex-1">
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
    </div>
    {planId === "start" ? (
      <Icon name="ChevronRight" size={16} className="shrink-0 text-white/40" />
    ) : (
      <div className="flex shrink-0 items-center gap-1">
        <button onClick={() => onToggle(ex.id)}>
          <Icon
            name="CheckCircle2"
            size={20}
            className={done ? "text-prime-pink" : "text-white/25"}
          />
        </button>
        {planId === "3d" && <Icon name="MoreVertical" size={14} className="text-white/35" />}
      </div>
    )}
  </div>
);

const WorkoutPhone = ({ planId, plan }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [done, setDone] = useState({});
  const toggle = (id) => setDone((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="relative w-full max-w-[330px] rounded-[2.4rem] border border-white/10 bg-black p-2.5 shadow-[0_25px_60px_-15px_rgba(236,72,153,0.35)]">
      <div className="max-h-[720px] overflow-y-auto rounded-[2rem] bg-[#0b0b0d] no-scrollbar">
        <StatusBar />

        {/* top bar */}
        <div className="flex items-center justify-center gap-2 px-5 py-3">
          <button onClick={() => navigate("/")} className="absolute left-6 text-white/70">
            <Icon name="ChevronLeft" size={18} />
          </button>
          <span className="text-sm font-bold text-white">
            Meu treino {planId !== "start" ? plan.name : ""}
          </span>
        </div>

        <WeekRow />

        <div className="space-y-3 px-3.5 pb-4 pt-2">
          {/* START workout header card */}
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

          {/* 2.0 personal card */}
          {planId === "2.0" && (
            <div className="rounded-2xl border border-white/8 bg-[#131215] p-3">
              <div className="flex items-center gap-3">
                <img src={TRAINER_IMG} alt="personal" className="h-10 w-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-prime-pink">{plan.personalNote}</p>
                  <p className="text-[9px] text-white/55">{plan.personalObjective}</p>
                  <p className="text-[9px] text-white/45">{plan.personalLevel}</p>
                </div>
                <button className="text-[10px] font-semibold text-prime-pink">Editar</button>
              </div>
            </div>
          )}

          {/* 3D personal + focus */}
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
                  <button
                    onClick={() => toast({ title: "Mensagem enviada para Juliana!" })}
                    className="rounded-lg bg-gradient-to-r from-prime-pink to-prime-pinkdeep px-3 py-1.5 text-[9px] font-bold text-white"
                  >
                    Enviar mensagem
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-prime-pink/25 bg-prime-pink/10 p-3">
                <p className="pr-2 text-[10px] font-medium leading-snug text-prime-pinklight">
                  {plan.focus}
                </p>
                <Icon name="ChevronDown" size={16} className="shrink-0 text-prime-pink" />
              </div>
            </>
          )}

          {/* exercises header */}
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px] font-bold text-white/85">
              {planId === "start" ? "Exercícios" : `${plan.workoutTitle} - ${plan.workoutName}`}
            </p>
            <span className="text-[9px] text-white/45">{plan.exercises.length} exercícios</span>
          </div>

          {/* exercises */}
          <div className="space-y-2">
            {plan.exercises.map((ex, i) => (
              <ExerciseItem
                key={ex.id}
                ex={ex}
                index={i}
                planId={planId}
                done={!!done[ex.id]}
                onToggle={toggle}
              />
            ))}
          </div>

          {planId === "2.0" && (
            <button className="w-full rounded-xl border border-dashed border-prime-pink/40 py-2.5 text-[11px] font-semibold text-prime-pink">
              + Adicionar exercício
            </button>
          )}

          <button
            onClick={() => toast({ title: "Treino iniciado! Bora treinar 💪" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white transition-transform hover:scale-[1.02]"
          >
            <Icon name="Play" size={16} className="fill-white" />
            Iniciar treino
          </button>
        </div>

        {/* bottom nav */}
        <div className="sticky bottom-0 flex items-center justify-between border-t border-white/8 bg-[#0b0b0d]/95 px-5 py-2.5 backdrop-blur">
          {bottomNav.map((n, i) => (
            <div key={i} className="relative flex flex-col items-center gap-0.5">
              <Icon
                name={n.icon}
                size={18}
                className={n.label === "Treino" ? "text-prime-pink" : "text-white/45"}
              />
              <span
                className={`text-[8px] ${n.label === "Treino" ? "text-prime-pink" : "text-white/45"}`}
              >
                {n.label}
              </span>
              {n.badge && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-prime-pink text-[7px] font-bold text-white">
                  {n.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPhone;
