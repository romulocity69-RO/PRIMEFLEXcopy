import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon";
import PeachLogo from "../PeachLogo";
import { brand, navItems } from "../../mock";
import LoginModal from "./LoginModal";

const scrollTargets = ["planos", "planos", "garantia", "features", "features"];

const Header = () => {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const goToSection = (i) => {
    const el = document.getElementById(scrollTargets[i]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <header className="relative z-30 border-b border-white/5 bg-prime-dark/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
        {/* Logo + Login */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-left"
          >
            <PeachLogo size={48} />
            <div className="leading-none">
              <p className="font-display text-[13px] font-medium tracking-[0.25em] text-white/85">
                {brand.name}
              </p>
              <p className="font-display text-2xl font-extrabold tracking-wide text-pink-gradient">
                {brand.name2}
              </p>
              <p className="mt-1 max-w-[190px] text-[8px] font-semibold leading-tight tracking-wider text-white/45">
                {brand.tagline}
              </p>
            </div>
          </button>
          <button
            onClick={() => setLoginOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-prime-pink/50 px-4 py-2 text-xs font-bold text-prime-pink transition-colors hover:bg-prime-pink/10"
          >
            <Icon name="UserRound" size={15} />
            Entrar
          </button>
        </div>

        {/* Nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => goToSection(i)}
              className="group flex cursor-pointer flex-col items-center gap-1.5"
            >
              <Icon
                name={item.icon}
                size={22}
                className="text-prime-pink transition-transform duration-300 group-hover:-translate-y-0.5"
                strokeWidth={1.6}
              />
              <div className="text-center">
                <p className="text-[9px] font-bold tracking-widest text-white/80">
                  {item.label}
                </p>
                <p className="text-[9px] font-bold tracking-widest text-white/45">
                  {item.sub}
                </p>
              </div>
            </button>
          ))}
        </nav>

        {/* Badge */}
        <div className="animate-pulse-glow rounded-xl border border-prime-gold/60 bg-gradient-to-b from-[#1a1712] to-[#0f0d0a] px-4 py-2.5 text-center">
          <p className="flex items-center justify-center gap-1 text-[11px] font-extrabold tracking-wide text-gold-gradient">
            <Icon name="Sparkles" size={12} className="text-prime-gold" />
            LANÇAMENTO EXCLUSIVO
          </p>
          <p className="text-[10px] font-semibold tracking-wide text-prime-gold/80">
            POR TEMPO LIMITADO!
          </p>
        </div>
      </div>
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  );
};

export default Header;
