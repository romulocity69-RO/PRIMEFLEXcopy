import Icon from "../Icon";
import PrimeFlexPhone from "./PrimeFlexPhone";
import { drika, primeFlex, HERO_IMG } from "../../mock";

const DrikaSidebar = () => (
  <aside className="flex flex-col gap-3">
    <div>
      <p className="font-script text-2xl text-white/85">{drika.hiName}</p>
      <p className="flex items-center gap-1.5 font-script text-3xl font-bold text-pink-gradient">
        {drika.name}
        <Icon name="Heart" size={16} className="text-prime-pink" />
      </p>
    </div>
    <p className="text-[12px] leading-relaxed text-white/60">{drika.bio}</p>
    <p className="font-script text-xl leading-snug text-pink-gradient">
      {drika.motto}
    </p>
    <div className="mt-1 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-prime-pink/40 text-prime-pink transition-colors hover:bg-prime-pink/10">
        <Icon name="Instagram" size={16} />
      </span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-prime-pink/40 text-prime-pink transition-colors hover:bg-prime-pink/10">
        <Icon name="Music2" size={16} />
      </span>
      <span className="text-[11px] font-medium text-white/55">
        {drika.instagram}
      </span>
    </div>
  </aside>
);

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-prime-dark">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-prime-pink/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-40 h-96 w-96 rounded-full bg-prime-gold/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-4 py-10 md:px-8 lg:grid-cols-[210px_minmax(0,1fr)_330px] lg:gap-6">
        {/* Left: Drika + woman photo */}
        <div className="flex flex-col gap-6">
          <DrikaSidebar />
        </div>

        {/* Middle: photo + prime flex text */}
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
          {/* photo */}
          <div className="relative mx-auto h-[440px] w-full max-w-[280px]">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-prime-pink/20 to-transparent blur-2xl" />
            <img
              src={HERO_IMG}
              alt="Modelo fitness Glúteo Prime"
              className="relative h-full w-full rounded-[2rem] object-cover object-top shadow-2xl"
            />
          </div>

          {/* text */}
          <div className="animate-fade-up">
            <span className="inline-block rounded-full bg-prime-pink/15 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-prime-pink ring-1 ring-prime-pink/30">
              {primeFlex.badge}
            </span>
            <h1 className="mt-3 flex flex-col leading-[0.85]">
              <span className="font-display text-6xl font-extrabold tracking-tight text-silver-gradient md:text-7xl">
                {primeFlex.title1}
              </span>
              <span className="-mt-1 font-brush text-7xl text-pink-gradient md:text-8xl">
                {primeFlex.title2}
              </span>
            </h1>
            <div className="mt-4 space-y-0.5">
              <p className="text-xl font-extrabold text-white md:text-2xl">
                {primeFlex.headline[0]}
              </p>
              <p className="text-xl font-extrabold text-white md:text-2xl">
                {primeFlex.headline[1]}
              </p>
              <p className="text-xl font-extrabold text-gold-gradient md:text-2xl">
                {primeFlex.headline[2]}
              </p>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
              {primeFlex.description}
            </p>

            {/* feature icons */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {primeFlex.features.map((feat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-prime-pink/30 bg-prime-pink/5 text-prime-pink">
                    <Icon name={feat.icon} size={18} strokeWidth={1.6} />
                  </span>
                  <p className="text-[10px] font-medium leading-tight text-white/55">
                    {feat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: phone */}
        <div className="flex justify-center lg:justify-end">
          <div className="animate-float">
            <PrimeFlexPhone />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
