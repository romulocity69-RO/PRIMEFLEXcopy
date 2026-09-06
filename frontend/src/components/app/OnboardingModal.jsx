import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import Icon from "../Icon";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/use-toast";

const GOALS = [
  { id: "hipertrofia", label: "Hipertrofia" },
  { id: "emagrecimento", label: "Emagrecimento" },
  { id: "forca", label: "Força" },
  { id: "condicionamento", label: "Condicionamento" },
  { id: "manutencao", label: "Manutenção" },
];
const LEVELS = [
  { id: "iniciante", label: "Iniciante" },
  { id: "intermediario", label: "Intermediário" },
  { id: "avancado", label: "Avançado" },
];

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
      active
        ? "bg-gradient-to-r from-prime-pink to-prime-pinkdeep text-white"
        : "border border-white/12 text-white/60 hover:border-prime-pink/40"
    }`}
  >
    {children}
  </button>
);

const Num = ({ label, value, onChange, suffix }) => (
  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2">
    <span className="text-[12px] text-white/60">{label}</span>
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        onChange={onChange}
        className="w-16 bg-transparent text-right text-sm font-bold text-white focus:outline-none"
      />
      <span className="text-[11px] text-white/40">{suffix}</span>
    </div>
  </div>
);

/**
 * Onboarding + Profile editing modal.
 * mode="onboarding" (após cadastro) | mode="edit" (perfil)
 */
const OnboardingModal = ({ open, onOpenChange, mode = "onboarding", onDone }) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const p = user?.profile || {};
  const [goal, setGoal] = useState(p.goal || "hipertrofia");
  const [level, setLevel] = useState(p.level || "iniciante");
  const [weight, setWeight] = useState(p.weight || "");
  const [height, setHeight] = useState(p.height || "");
  const [age, setAge] = useState(p.age || "");
  const [days, setDays] = useState(p.days_per_week || 3);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({
        goal,
        level,
        weight: weight ? Number(weight) : undefined,
        height: height ? Number(height) : undefined,
        age: age ? Number(age) : undefined,
        days_per_week: Number(days),
        onboarding_done: true,
      });
      toast({ title: mode === "edit" ? "Perfil atualizado!" : "Tudo pronto! 💪" });
      onOpenChange(false);
      onDone && onDone();
    } catch (e) {
      toast({ title: "Não foi possível salvar. Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto border-white/10 bg-prime-card text-white no-scrollbar">
        <DialogTitle className="sr-only">{mode === "edit" ? "Editar perfil" : "Vamos personalizar seu treino"}</DialogTitle>
        <DialogDescription className="sr-only">Preencha seus dados de treino</DialogDescription>

        <div className="text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-prime-pink/15 text-prime-pink">
            <Icon name="Target" size={20} />
          </span>
          <h3 className="mt-2 font-display text-xl font-extrabold text-white">
            {mode === "edit" ? "Editar perfil" : "Vamos te conhecer melhor"}
          </h3>
          <p className="text-[12px] text-white/55">Isso personaliza seus treinos e sua evolução</p>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold tracking-wide text-white/70">Seu objetivo</p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <Chip key={g.id} active={goal === g.id} onClick={() => setGoal(g.id)}>{g.label}</Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold tracking-wide text-white/70">Nível de experiência</p>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <Chip key={l.id} active={level === l.id} onClick={() => setLevel(l.id)}>{l.label}</Chip>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Num label="Peso" value={weight} onChange={(e) => setWeight(e.target.value)} suffix="kg" />
          <Num label="Altura" value={height} onChange={(e) => setHeight(e.target.value)} suffix="cm" />
          <Num label="Idade" value={age} onChange={(e) => setAge(e.target.value)} suffix="anos" />
          <Num label="Dias por semana" value={days} onChange={(e) => setDays(e.target.value)} suffix="x" />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {saving && <Icon name="Loader2" size={15} className="animate-spin" />}
          {mode === "edit" ? "Salvar alterações" : "Começar meus treinos"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
