import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import Icon from "../Icon";
import { panelContents } from "../../mock";

const PanelModal = ({ label, open, onOpenChange }) => {
  const content = label ? panelContents[label] : null;
  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/10 bg-prime-card text-white">
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">{content.desc}</DialogDescription>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-prime-pink/30 bg-prime-pink/10 text-prime-pink">
            <Icon name={content.icon} size={20} />
          </span>
          <h3 className="font-display text-lg font-extrabold text-white">{label}</h3>
        </div>

        <p className="text-[12px] leading-relaxed text-white/60">{content.desc}</p>

        <div className="space-y-2 rounded-xl border border-white/8 bg-black/30 p-4">
          {content.rows.map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-[12px] text-white/65">{r.label}</span>
              <span className="text-[12px] font-bold text-white">{r.value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="w-full rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white transition-transform hover:scale-[1.02]"
        >
          Fechar
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default PanelModal;
