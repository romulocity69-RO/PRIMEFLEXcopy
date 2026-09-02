import Icon from "../Icon";
import { diasExtras } from "../../mock";

const DiasExtras = () => {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-prime-gold/30 bg-gradient-to-r from-[#1a1611] via-[#0f0d0a] to-[#1a1611] p-6 md:p-8">
        {/* sparkle dots */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-10 top-6 h-1 w-1 rounded-full bg-prime-gold" />
          <div className="absolute right-24 top-10 h-1.5 w-1.5 rounded-full bg-prime-gold" />
          <div className="absolute bottom-8 left-1/3 h-1 w-1 rounded-full bg-prime-gold" />
        </div>
        <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_auto]">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-prime-gold/70">
              {diasExtras.badge}
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-gold-gradient md:text-4xl">
              {diasExtras.title}
            </h2>
            <p className="text-sm font-semibold tracking-wide text-white/80">
              {diasExtras.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {diasExtras.items.map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] font-bold tracking-widest text-white/55">
                  {item.period}
                </p>
                <p className="font-display text-4xl font-extrabold text-gold-gradient md:text-5xl">
                  {item.days}
                </p>
                <p className="text-xs font-bold tracking-widest text-white/70">
                  {item.unit}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-prime-gold/25 bg-black/30 p-4">
            <Icon name="Crown" size={26} className="shrink-0 text-prime-gold" />
            <p className="max-w-[150px] text-[11px] font-semibold leading-snug text-gold-gradient">
              {diasExtras.cta}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiasExtras;
