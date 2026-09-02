import Icon from "../Icon";
import { bottomFeatures, brand } from "../../mock";

const FeaturesBar = () => {
  return (
    <footer className="mx-auto max-w-[1400px] px-4 pb-12 pt-2 md:px-8">
      <div className="grid grid-cols-1 gap-6 border-t border-white/8 py-8 sm:grid-cols-2 lg:grid-cols-5">
        {bottomFeatures.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <Icon name={f.icon} size={26} className="shrink-0 text-prime-pink" strokeWidth={1.6} />
            <div>
              <p className="text-[11px] font-extrabold leading-tight tracking-wide text-white/85">
                {f.title}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-white/50">{f.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/8 pt-6 text-center">
        <p className="font-display text-lg font-extrabold tracking-wide text-white md:text-xl">
          {brand.footer}
        </p>
        <p className="font-display text-lg font-extrabold tracking-wide text-pink-gradient md:text-xl">
          {brand.footerAccent}
        </p>
        <Icon name="Heart" size={18} className="text-prime-pink" />
      </div>
    </footer>
  );
};

export default FeaturesBar;
