import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import Icon from "../Icon";
import { useToast } from "../../hooks/use-toast";

const StartWorkoutModal = ({ open, onOpenChange, plan, exercises }) => {
  const { toast } = useToast();

  const finish = () => {
    onOpenChange(false);
    toast({ title: "Treino concluído! 🎉", description: "Parabéns, mais um dia rumo à sua melhor versão." });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/10 bg-prime-card text-white">
        <DialogTitle className="sr-only">Treino iniciado</DialogTitle>
        <DialogDescription className="sr-only">Seu treino de hoje começou</DialogDescription>

        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-prime-pink/15 text-prime-pink">
            <Icon name="Play" size={26} className="fill-prime-pink" />
          </span>
          <h3 className="mt-3 font-display text-xl font-extrabold text-white">Treino iniciado!</h3>
          <p className="text-[12px] text-white/60">
            {plan?.workoutTitle} · {plan?.workoutName}
          </p>
        </div>

        <div className="max-h-52 space-y-2 overflow-y-auto rounded-xl border border-white/8 bg-black/30 p-3 no-scrollbar">
          {exercises?.map((ex, i) => (
            <div key={ex.id} className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-prime-pink/15 text-[10px] font-bold text-prime-pink">
                {i + 1}
              </span>
              <span className="flex-1 text-[12px] text-white/80">{ex.name}</span>
              <span className="text-[10px] text-white/45">{ex.sets}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border border-white/10 py-3 text-xs font-bold text-white/70 transition-colors hover:border-white/25"
          >
            Voltar
          </button>
          <button
            onClick={finish}
            className="flex-1 rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-xs font-extrabold text-white transition-transform hover:scale-[1.02]"
          >
            Concluir treino
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartWorkoutModal;
