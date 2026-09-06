import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../Icon";
import { profileData, TRAINER_IMG } from "../../../mock";
import { useToast } from "../../../hooks/use-toast";
import { useAuth } from "../../../context/AuthContext";
import OnboardingModal from "../OnboardingModal";

const PerfilTab = ({ planName }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, isAuthenticated } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const p = profileData;
  const prof = user?.profile || {};
  const displayName = user?.name || "Visitante";
  const displayEmail = user?.email || "Faça login para salvar seu progresso";
  const plan = user?.plan === "premium" ? "Premium" : planName;

  const stats = [
    { label: "Objetivo", value: prof.goal ? cap(prof.goal) : "—" },
    { label: "Peso", value: prof.weight ? `${prof.weight} kg` : "—" },
    { label: "Nível", value: prof.level ? cap(prof.level) : "—" },
  ];

  return (
    <div className="space-y-3 px-3.5 pb-4 pt-3">
      {/* header */}
      <div className="flex flex-col items-center rounded-2xl border border-white/8 bg-gradient-to-b from-[#17151a] to-[#0f0e11] p-5 text-center">
        <img src={TRAINER_IMG} alt="perfil" className="h-16 w-16 rounded-full object-cover ring-2 ring-prime-pink" />
        <p className="mt-2 font-display text-base font-extrabold text-white">{displayName}</p>
        <p className="text-[10px] text-white/50">{displayEmail}</p>
        <span className="mt-2 rounded-full bg-prime-pink/15 px-3 py-1 text-[10px] font-bold text-prime-pink">
          Plano {plan}
        </span>
        {isAuthenticated && (
          <button
            onClick={() => setEditOpen(true)}
            className="mt-3 flex items-center gap-1.5 rounded-full border border-white/12 px-4 py-1.5 text-[11px] font-bold text-white/75 hover:border-prime-pink/40"
          >
            <Icon name="Pencil" size={12} /> Editar perfil
          </button>
        )}
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map((st, i) => (
          <div key={i} className="rounded-xl border border-white/8 bg-[#131215] p-3 text-center">
            <p className="text-sm font-extrabold text-white">{st.value}</p>
            <p className="text-[8px] text-white/45">{st.label}</p>
          </div>
        ))}
      </div>

      {/* menu */}
      <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#131215]">
        {p.menu.map((m, i) => (
          <button
            key={m.label}
            onClick={() => toast({ title: `${m.label} (em breve)` })}
            className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors last:border-0 hover:bg-white/5"
          >
            <Icon name={m.icon} size={16} className="text-prime-pink" />
            <span className="flex-1 text-[12px] text-white/80">{m.label}</span>
            <Icon name="ChevronRight" size={14} className="text-white/30" />
          </button>
        ))}
      </div>

      {isAuthenticated ? (
        <button
          onClick={() => { logout(); toast({ title: "Você saiu da conta." }); navigate("/"); }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-xs font-bold text-white/60 transition-colors hover:border-prime-pink/40 hover:text-white"
        >
          <Icon name="LogOut" size={15} /> Sair
        </button>
      ) : (
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-xs font-extrabold text-white"
        >
          <Icon name="UserRound" size={15} /> Entrar / Criar conta
        </button>
      )}

      <OnboardingModal open={editOpen} onOpenChange={setEditOpen} mode="edit" />
    </div>
  );
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default PerfilTab;
