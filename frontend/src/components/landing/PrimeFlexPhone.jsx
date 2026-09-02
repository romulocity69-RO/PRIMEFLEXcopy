import Icon from "../Icon";
import { phoneFlex } from "../../mock";

const PhoneFrame = ({ children }) => (
  <div className="relative w-full max-w-[320px] rounded-[2.4rem] border border-white/10 bg-black p-2.5 shadow-[0_25px_60px_-15px_rgba(236,72,153,0.35)]">
    <div className="overflow-hidden rounded-[2rem] bg-[#0b0b0d]">{children}</div>
  </div>
);

const PrimeFlexPhone = () => {
  const f = phoneFlex;
  return (
    <PhoneFrame>
      {/* status bar */}
      <div className="flex items-center justify-between px-5 pt-3 text-[11px] font-medium text-white/80">
        <span>{f.time}</span>
        <div className="flex items-center gap-1">
          <Icon name="SignalHigh" size={13} />
          <Icon name="Wifi" size={13} />
          <Icon name="BatteryFull" size={15} />
        </div>
      </div>

      {/* app header */}
      <div className="flex items-center justify-center gap-2 px-5 pb-3 pt-4">
        <span className="font-display text-sm font-extrabold tracking-wide text-white">
          {f.appTitle}
        </span>
        <span className="rounded-md bg-prime-gold/15 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-prime-gold">
          {f.appTag}
        </span>
      </div>

      <div className="space-y-3 px-3.5 pb-5">
        {/* days card */}
        <div className="rounded-2xl border border-white/8 bg-gradient-to-b from-[#17151a] to-[#0f0e11] p-4 text-center">
          <p className="text-[10px] font-medium text-white/60">{f.availLabel}</p>
          <p className="my-1 font-display text-4xl font-extrabold text-gold-gradient">
            {f.availDays}
          </p>
          <p className="text-[11px] font-semibold text-white/80">{f.plan}</p>
          <p className="text-[9px] text-white/45">{f.planNote}</p>
          <button className="mt-3 w-full rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-2.5 text-xs font-bold tracking-wide text-white transition-transform hover:scale-[1.02]">
            {f.button}
          </button>
        </div>

        {/* calendar */}
        <div className="rounded-2xl border border-white/8 bg-[#111013] p-3.5">
          <p className="mb-2 text-center text-[10px] font-bold tracking-widest text-prime-gold">
            {f.monthLabel}
          </p>
          <div className="grid grid-cols-7 gap-y-1 text-center">
            {f.weekDays.map((d, i) => (
              <span key={i} className="text-[8px] font-semibold text-white/35">
                {d}
              </span>
            ))}
            {f.calendar.map((c, i) => (
              <div key={i} className="flex items-center justify-center py-0.5">
                <span
                  className={[
                    "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-medium",
                    c.active ? "bg-prime-pink text-white" : "",
                    c.gold ? "bg-prime-gold/25 text-prime-gold" : "",
                    c.ring ? "border border-prime-pink text-prime-pink" : "",
                    !c.active && !c.gold && !c.ring ? "text-white/60" : "",
                  ].join(" ")}
                >
                  {c.d}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* history */}
        <div className="rounded-2xl border border-white/8 bg-[#111013] p-3.5">
          <p className="mb-2 text-[10px] font-semibold text-white/80">
            {f.historyTitle}
          </p>
          <div className="space-y-2">
            {f.history.map((h, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] text-white/70">{h.range}</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] ${
                      h.done ? "text-white/50" : "text-prime-pink"
                    }`}
                  >
                    {h.note}
                  </span>
                  {h.done ? (
                    <Icon name="CheckCircle2" size={13} className="text-emerald-400" />
                  ) : (
                    <span className="h-3 w-3 rounded-full bg-prime-pink" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="px-1 text-[8px] leading-relaxed text-white/35">
          {f.footerNote}
        </p>
      </div>
    </PhoneFrame>
  );
};

export default PrimeFlexPhone;
