import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import Icon from "../Icon";
import { flexPause } from "../../mock";
import { useToast } from "../../hooks/use-toast";

const FlexModal = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState(0);
  const f = flexPause;

  const confirm = () => {
    onOpenChange(false);
    toast({
      title: "Treino pausado com Prime Flex!",
      description: `${f.options[selected].days} de pausa. Seu plano foi estendido automaticamente.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/10 bg-prime-card text-white">
        <DialogTitle className="sr-only">{f.title}</DialogTitle>
        <DialogDescription className="sr-only">{f.subtitle}</DialogDescription>
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-prime-gold/15 text-prime-gold">
            <Icon name="Sparkles" size={22} />
          </span>
          <h3 className="mt-3 font-display text-xl font-extrabold text-gold-gradient">{f.title}</h3>
          <p className="text-[12px] text-white/60">{f.subtitle}</p>
          <p className="mt-2 text-[11px] text-white/45">
            Disponível: <span className="font-bold text-prime-gold">{f.available}</span>
          </p>
        </div>

        <div className="space-y-2">
          {f.options.map((o, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                selected === i ? "border-prime-pink bg-prime-pink/10" : "border-white/10 hover:border-white/25"
              }`}
            >
              <div>
                <p className="text-sm font-bold text-white">{o.days}</p>
                <p className="text-[10px] text-white/50">{o.note}</p>
              </div>
              <Icon
                name={selected === i ? "CheckCircle2" : "Circle"}
                size={18}
                className={selected === i ? "text-prime-pink" : "text-white/25"}
              />
            </button>
          ))}
        </div>

        <p className="text-[10px] leading-snug text-white/40">{f.note}</p>

        <button
          onClick={confirm}
          className="w-full rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white transition-transform hover:scale-[1.02]"
        >
          Confirmar pausa
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default FlexModal;
