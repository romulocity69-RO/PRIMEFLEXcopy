import { useNavigate } from "react-router-dom";
import Icon from "../Icon";
import { plans } from "../../mock";

const PlanCard = ({ plan }) => {
  const navigate = useNavigate();
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#151316] to-[#0d0c0e] p-6 transition-all duration-300 hover:border-prime-pink/40 hover:shadow-[0_20px_50px_-20px_rgba(236,72,153,0.4)]">
      {/* discount ribbon */}
      <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-prime-gold to-prime-golddeep px-4 py-2 text-center">
        <p className="text-lg font-extrabold leading-none text-black">
          {plan.discount.split(" ")[0]}
        </p>
        <p className="text-[10px] font-bold leading-none text-black/80">OFF</p>
      </div>

      <span className="inline-block rounded-md border border-white/15 px-2 py-0.5 text-[9px] font-bold tracking-widest text-white/60">
        {plan.label}
      </span>
      <div className="mt-1 flex items-center gap-2">
        <h3 className="font-display text-5xl font-extrabold text-pink-gradient">
          {plan.name}
        </h3>
        <Icon name={plan.icon} size={26} className="text-prime-pink" />
      </div>
      <p className="mt-1 max-w-[220px] text-xs font-bold tracking-wide text-white/70">
        {plan.subtitle}
      </p>

      {/* features */}
      <ul className="mt-4 space-y-2">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-[13px] text-white/75">
            <Icon name="CheckCircle2" size={15} className="shrink-0 text-prime-pink" />
            {f}
          </li>
        ))}
      </ul>

      {/* pricing rows */}
      <div className="mt-5 space-y-3 border-t border-white/8 pt-4">
        {plan.pricing.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-prime-pink">
                {p.period}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[11px] text-white/35 line-through">{p.old}</span>
                <span className="font-display text-base font-extrabold text-white">
                  {p.price}
                </span>
                <span className="text-[10px] text-white/50">{p.unit}</span>
              </div>
              {p.perMonth && (
                <p className="text-[9px] text-white/40">{p.perMonth}</p>
              )}
            </div>
            <span className="rounded-md bg-prime-gold/15 px-2 py-1 text-[9px] font-bold tracking-wide text-prime-gold">
              {p.extra}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate(`/contratar/${plan.id}`)}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3.5 text-sm font-extrabold tracking-wide text-white transition-transform duration-200 hover:scale-[1.02]"
      >
        {plan.button}
      </button>
      <p className="mt-3 text-center text-[11px] font-medium text-prime-pink/80">
        {plan.tagline}
      </p>
    </div>
  );
};

const PricingPlans = () => {
  return (
    <section id="planos" className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
};

export default PricingPlans;
