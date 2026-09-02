import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon";
import { bottomNav, EXERCISE_IMGS } from "../../mock";
import { useToast } from "../../hooks/use-toast";
import TreinoTab from "./tabs/TreinoTab";
import InicioTab from "./tabs/InicioTab";
import EvolucaoTab from "./tabs/EvolucaoTab";
import MensagensTab from "./tabs/MensagensTab";
import PerfilTab from "./tabs/PerfilTab";
import ExerciseModal from "./ExerciseModal";
import FlexModal from "./FlexModal";
import StartWorkoutModal from "./StartWorkoutModal";

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

const EXTRA_EXERCISES = [
  { id: 101, name: "Levantamento Terra Romeno", img: EXERCISE_IMGS.squat, sets: "3 séries", reps: "10–12 reps", rest: "Descanso: 90s", suggested: "35 kg", prev: "35 kg", current: "37,5 kg", videoId: "-1cAnwFNBLg", videoQuery: "levantamento terra romeno execução", tips: "Mantenha as costas retas e leve o quadril para trás sentindo o posterior alongar." },
  { id: 102, name: "Elevação Pélvica na Máquina", img: EXERCISE_IMGS.hipthrust, sets: "3 séries", reps: "12–15 reps", rest: "Descanso: 60s", suggested: "50 kg", prev: "50 kg", current: "52,5 kg", videoId: "1aHaxoVUhtk", videoQuery: "elevação pélvica máquina glúteo", tips: "Contraia o glúteo no topo e desça controlando por 2 segundos." },
];

const WorkoutPhone = ({ planId, plan }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("Treino");
  const [done, setDone] = useState({});
  const [exercises, setExercises] = useState(plan.exercises);
  const [selectedEx, setSelectedEx] = useState(null);
  const [exOpen, setExOpen] = useState(false);
  const [flexOpen, setFlexOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [addIdx, setAddIdx] = useState(0);

  const toggle = (id) => setDone((p) => ({ ...p, [id]: !p[id] }));

  const openExercise = (ex) => {
    setSelectedEx(ex);
    setExOpen(true);
  };

  const addExercise = () => {
    const next = EXTRA_EXERCISES[addIdx % EXTRA_EXERCISES.length];
    setExercises((list) => [...list, { ...next, id: next.id + list.length }]);
    setAddIdx((i) => i + 1);
    toast({ title: `Exercício adicionado: ${next.name}` });
  };

  const startWorkout = () => setStartOpen(true);

  const titleMap = {
    Início: "Início",
    Treino: `Meu treino ${planId !== "start" ? plan.name : ""}`.trim(),
    Evolução: "Evolução",
    Mensagens: "Mensagens",
    Perfil: "Perfil",
  };

  return (
    <div className="relative w-full max-w-[330px] rounded-[2.4rem] border border-white/10 bg-black p-2.5 shadow-[0_25px_60px_-15px_rgba(236,72,153,0.35)]">
      <div className="flex max-h-[720px] min-h-[640px] flex-col overflow-hidden rounded-[2rem] bg-[#0b0b0d]">
        <StatusBar />

        {/* top bar */}
        <div className="relative flex items-center justify-center px-5 py-3">
          {(tab === "Treino") && (
            <button onClick={() => navigate("/")} className="absolute left-6 text-white/70">
              <Icon name="ChevronLeft" size={18} />
            </button>
          )}
          <span className="text-sm font-bold text-white">{titleMap[tab]}</span>
        </div>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {tab === "Início" && <InicioTab onGoTreino={() => setTab("Treino")} />}
          {tab === "Treino" && (
            <TreinoTab
              planId={planId}
              plan={plan}
              exercises={exercises}
              done={done}
              onToggle={toggle}
              onOpen={openExercise}
              onAdd={addExercise}
              onStart={startWorkout}
              onFlex={() => setFlexOpen(true)}
            />
          )}
          {tab === "Evolução" && <EvolucaoTab plan={plan} />}
          {tab === "Mensagens" && <MensagensTab />}
          {tab === "Perfil" && <PerfilTab planName={plan.name} />}
        </div>

        {/* bottom nav */}
        <div className="flex items-center justify-between border-t border-white/8 bg-[#0b0b0d]/95 px-5 py-2.5 backdrop-blur">
          {bottomNav.map((n, i) => {
            const active = tab === n.label;
            return (
              <button
                key={i}
                onClick={() => setTab(n.label)}
                className="relative flex flex-col items-center gap-0.5"
              >
                <Icon name={n.icon} size={18} className={active ? "text-prime-pink" : "text-white/45"} />
                <span className={`text-[8px] ${active ? "text-prime-pink" : "text-white/45"}`}>
                  {n.label}
                </span>
                {n.badge && (
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-prime-pink text-[7px] font-bold text-white">
                    {n.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <ExerciseModal exercise={selectedEx} open={exOpen} onOpenChange={setExOpen} />
      <FlexModal open={flexOpen} onOpenChange={setFlexOpen} />
      <StartWorkoutModal open={startOpen} onOpenChange={setStartOpen} plan={plan} exercises={exercises} />
    </div>
  );
};

export default WorkoutPhone;
