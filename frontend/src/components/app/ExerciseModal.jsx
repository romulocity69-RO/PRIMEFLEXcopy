import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import Icon from "../Icon";

const ExerciseModal = ({ exercise, open, onOpenChange }) => {
  if (!exercise) return null;
  const query = encodeURIComponent(exercise.videoQuery || exercise.name);
  const embed = exercise.videoId
    ? `https://www.youtube-nocookie.com/embed/${exercise.videoId}?rel=0`
    : `https://www.youtube.com/embed?listType=search&list=${query}`;
  const watchUrl = exercise.videoId
    ? `https://www.youtube.com/watch?v=${exercise.videoId}`
    : `https://www.youtube.com/results?search_query=${query}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 border-white/10 bg-prime-card p-0 text-white">
        <DialogTitle className="sr-only">{exercise.name}</DialogTitle>
        <DialogDescription className="sr-only">Detalhes e execução do exercício {exercise.name}</DialogDescription>
        {/* video */}
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-black">
          <iframe
            title={exercise.name}
            src={embed}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-extrabold text-white">{exercise.name}</h3>
            {exercise.tag && (
              <span className="rounded bg-prime-pink/15 px-2 py-0.5 text-[9px] font-bold text-prime-pink">
                {exercise.tag}
              </span>
            )}
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-prime-pink hover:underline"
            >
              <Icon name="Youtube" size={13} /> Assistir no YouTube
            </a>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { l: "Séries", v: exercise.sets?.replace(" séries", "") },
              { l: "Repetições", v: exercise.reps },
              { l: "Descanso", v: exercise.rest?.replace("Descanso: ", "") },
            ].map((s, i) => (
              <div key={i} className="rounded-lg bg-black/30 p-2.5 text-center">
                <p className="text-[9px] text-white/45">{s.l}</p>
                <p className="text-[11px] font-bold text-white">{s.v}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-prime-pink/20 bg-prime-pink/5 p-3">
            <Icon name="Lightbulb" size={16} className="mt-0.5 shrink-0 text-prime-pink" />
            <div>
              <p className="text-[11px] font-bold text-prime-pinklight">Dica de execução</p>
              <p className="text-[11px] leading-snug text-white/70">{exercise.tips}</p>
            </div>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white transition-transform hover:scale-[1.02]"
          >
            Entendi
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseModal;
