import { useParams, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import PeachLogo from "../components/PeachLogo";
import WorkoutPhone from "../components/app/WorkoutPhone";
import SidePanels3D from "../components/app/SidePanels3D";
import BarChart from "../components/app/BarChart";
import { appPlans } from "../mock";
import { useToast } from "../hooks/use-toast";

const planTabs = [
  { id: "start", label: "START", icon: "Apple" },
  { id: "2.0", label: "2.0", icon: "Dumbbell" },
  { id: "3d", label: "3D", icon: "Gem" },
];

const ReceivePanel = ({ plan }) => (
  <div className="w-full max-w-[330px] rounded-2xl border border-white/8 bg-[#111013] p-4">
    <p className="mb-3 text-[11px] font-bold tracking-wide text-prime-pink">
      {plan.receiveTitle}
    </p>
    <ul className="space-y-2.5">
      {plan.receive.map((r, i) => (
        <li key={i} className="flex items-center gap-2 text-[12px] text-white/75">
          <Icon name="CheckCircle2" size={15} className="shrink-0 text-prime-pink" />
          {r}
        </li>
      ))}
    </ul>
  </div>
);

const AppDashboard = () => {
  const { plan: rawPlan } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const planId = ["start", "2.0", "3d"].includes(rawPlan) ? rawPlan : "start";
  const plan = appPlans[planId];

  return (
    <div className="min-h-screen bg-prime-dark text-white">
      {/* header */}
      <header className="border-b border-white/6 bg-prime-dark/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 md:px-8">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <PeachLogo size={34} />
            <div className="flex items-center gap-1.5">
              <span className="font-display text-sm font-semibold tracking-widest text-white/85">
                GLÚTEO
              </span>
              <span className="font-display text-lg font-extrabold text-pink-gradient">
                {plan.name}
              </span>
              <Icon name={plan.icon} size={16} className="text-prime-pink" />
            </div>
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-[12px] font-medium text-white/60 transition-colors hover:text-white"
          >
            <Icon name="ArrowLeft" size={15} /> Voltar ao site
          </button>
        </div>
      </header>

      {/* plan switcher */}
      <div className="mx-auto flex max-w-[1200px] items-center gap-2 px-4 pt-6 md:px-8">
        {planTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(`/app/${t.id}`)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all ${
              planId === t.id
                ? "bg-gradient-to-r from-prime-pink to-prime-pinkdeep text-white"
                : "border border-white/10 text-white/55 hover:border-prime-pink/40"
            }`}
          >
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <p className="mx-auto max-w-[1200px] px-4 pt-3 text-[11px] font-semibold tracking-widest text-white/45 md:px-8">
        {plan.subtitle}
      </p>

      {/* content */}
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8">
        <div className="flex flex-col items-start justify-center gap-6 lg:flex-row">
          {/* left: phone + receive */}
          <div className="flex w-full flex-col items-center gap-5 lg:w-auto">
            <WorkoutPhone planId={planId} plan={plan} />
            <ReceivePanel plan={plan} />
          </div>

          {/* right: side panels / chart */}
          <div className="flex w-full flex-col items-center gap-5 lg:w-auto">
            {planId === "3d" && <SidePanels3D data={plan.sidePanels} />}

            {planId === "2.0" && (
              <div className="w-full max-w-[330px] rounded-2xl border border-white/8 bg-[#111013] p-4">
                <p className="text-[11px] font-bold text-white/85">{plan.chartTitle}</p>
                <p className="mb-3 text-[9px] text-white/45">{plan.chartSub}</p>
                <BarChart data={plan.chart} />
                <button
                  onClick={() => toast({ title: "Histórico completo (demonstração)" })}
                  className="mt-2 flex items-center gap-1 text-[9px] font-semibold text-prime-pink"
                >
                  Ver histórico completo <Icon name="ChevronRight" size={11} />
                </button>
              </div>
            )}

            {planId === "start" && (
              <div className="w-full max-w-[330px] rounded-2xl border border-prime-gold/25 bg-gradient-to-b from-[#181510] to-[#0f0d0a] p-5 text-center">
                <Icon name="Crown" size={30} className="mx-auto text-prime-gold" />
                <p className="mt-3 font-display text-base font-extrabold text-gold-gradient">
                  Quer mais resultado?
                </p>
                <p className="mt-1 text-[11px] text-white/60">
                  Faça upgrade para o Prime 2.0 e tenha treino personalizado e
                  acompanhamento da personal.
                </p>
                <button
                  onClick={() => navigate("/app/2.0")}
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-2.5 text-xs font-bold text-white"
                >
                  Ver Prime 2.0
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDashboard;
