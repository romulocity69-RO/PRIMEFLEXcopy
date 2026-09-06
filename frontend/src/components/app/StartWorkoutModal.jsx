import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import Icon from "../Icon";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/AuthContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const StartWorkoutModal = ({ open, onOpenChange, plan, exercises }) => {
  const { toast } = useToast();
  const { token, isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);
  // logs[exId] = [{weight, reps}, ...] one entry per série
  const [logs, setLogs] = useState({});

  const seriesCount = (ex) => {
    const m = /(\d+)/.exec(ex.sets || "3");
    return m ? Math.min(parseInt(m[1], 10), 6) : 3;
  };

  const setVal = (exId, idx, field, value) => {
    setLogs((prev) => {
      const arr = prev[exId] ? [...prev[exId]] : [];
      arr[idx] = { ...(arr[idx] || { weight: "", reps: "" }), [field]: value };
      return { ...prev, [exId]: arr };
    });
  };

  const finish = async () => {
    const payloadExercises = exercises.map((ex) => ({
      name: ex.name,
      series: (logs[ex.id] || [])
        .filter((s) => s && (s.weight || s.reps))
        .map((s) => ({ weight: Number(s.weight) || 0, reps: Number(s.reps) || 0 })),
    }));

    if (isAuthenticated && token) {
      setSaving(true);
      try {
        await axios.post(
          `${BACKEND_URL}/api/workouts/session/finish`,
          {
            plan_id: plan?.name?.toLowerCase() || "start",
            workout_name: `${plan?.workoutTitle} · ${plan?.workoutName}`,
            duration_seconds: 0,
            exercises: payloadExercises,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast({ title: "Treino concluído! 🎉", description: "Salvo no seu histórico." });
        onOpenChange(false);
      } catch (e) {
        toast({ title: "Erro ao salvar o treino", description: "Tente novamente." });
      } finally {
        setSaving(false);
      }
    } else {
      onOpenChange(false);
      toast({
        title: "Treino concluído! 🎉",
        description: "Faça login para salvar no seu histórico.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto border-white/10 bg-prime-card p-0 text-white no-scrollbar">
        <DialogTitle className="sr-only">Treino iniciado</DialogTitle>
        <DialogDescription className="sr-only">Registre carga e repetições de cada série</DialogDescription>

        <div className="sticky top-0 z-10 bg-prime-card px-5 pb-3 pt-5 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-prime-pink/15 text-prime-pink">
            <Icon name="Dumbbell" size={22} />
          </span>
          <h3 className="mt-2 font-display text-lg font-extrabold text-white">Treino em andamento</h3>
          <p className="text-[11px] text-white/55">Registre carga (kg) e repetições de cada série</p>
        </div>

        <div className="space-y-3 px-4 pb-2">
          {exercises?.map((ex) => (
            <div key={ex.id} className="rounded-xl border border-white/8 bg-black/30 p-3">
              <p className="mb-2 text-[12px] font-bold text-white">{ex.name}</p>
              <div className="space-y-1.5">
                {Array.from({ length: seriesCount(ex) }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-12 text-[10px] font-semibold text-white/45">Série {idx + 1}</span>
                    <input
                      type="number"
                      placeholder="kg"
                      value={logs[ex.id]?.[idx]?.weight ?? ""}
                      onChange={(e) => setVal(ex.id, idx, "weight", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-center text-[12px] text-white placeholder:text-white/30 focus:border-prime-pink focus:outline-none"
                    />
                    <span className="text-white/30">×</span>
                    <input
                      type="number"
                      placeholder="reps"
                      value={logs[ex.id]?.[idx]?.reps ?? ""}
                      onChange={(e) => setVal(ex.id, idx, "reps", e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-center text-[12px] text-white placeholder:text-white/30 focus:border-prime-pink focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 flex gap-2 bg-prime-card p-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border border-white/10 py-3 text-xs font-bold text-white/70 transition-colors hover:border-white/25"
          >
            Cancelar
          </button>
          <button
            onClick={finish}
            disabled={saving}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-xs font-extrabold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {saving && <Icon name="Loader2" size={14} className="animate-spin" />}
            Concluir treino
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartWorkoutModal;
