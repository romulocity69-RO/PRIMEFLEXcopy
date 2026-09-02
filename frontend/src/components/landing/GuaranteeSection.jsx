import Icon from "../Icon";
import { guarantee } from "../../mock";

const GuaranteeSection = () => {
  const g = guarantee;
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
      <div className="grid grid-cols-1 items-center gap-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#141216] to-[#0d0c0e] p-6 md:grid-cols-3 md:p-8">
        {/* guarantee */}
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-prime-pink/30 bg-prime-pink/10 text-prime-pink">
            <Icon name="ShieldCheck" size={30} />
          </span>
          <div>
            <p className="font-display text-lg font-extrabold text-white">
              {g.title}
            </p>
            <p className="max-w-[220px] text-xs text-white/60">{g.text}</p>
          </div>
        </div>

        {/* script center */}
        <div className="flex items-center justify-center gap-2 text-center">
          <div>
            <p className="font-script text-3xl text-pink-gradient">{g.script1}</p>
            <p className="font-script text-3xl text-pink-gradient">{g.script2}</p>
          </div>
          <Icon name="Heart" size={26} className="text-prime-pink" />
        </div>

        {/* rating */}
        <div className="text-center md:text-right">
          <p className="font-display text-lg font-extrabold tracking-wide text-white">
            {g.ratingLabel}
          </p>
          <div className="mt-1 flex items-center justify-center gap-1 md:justify-end">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-[#00b67a]"
              >
                <Icon name="Star" size={13} className="fill-white text-white" />
              </span>
            ))}
            <span className="ml-1.5 flex items-center gap-1 text-sm font-bold text-white">
              <Icon name="Star" size={14} className="fill-[#00b67a] text-[#00b67a]" />
              {g.trustpilot}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-white/55">{g.ratingNote}</p>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;
