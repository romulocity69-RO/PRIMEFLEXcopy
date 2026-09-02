import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/landing/Header";
import HeroSection from "../components/landing/HeroSection";
import DiasExtras from "../components/landing/DiasExtras";
import PricingPlans from "../components/landing/PricingPlans";
import GuaranteeSection from "../components/landing/GuaranteeSection";
import FeaturesBar from "../components/landing/FeaturesBar";
import Icon from "../components/Icon";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-prime-dark text-white">
      <Header />
      <HeroSection />
      <div className="reveal">
        <DiasExtras />
      </div>
      <div className="reveal">
        <PricingPlans />
      </div>
      <div className="reveal">
        <GuaranteeSection />
      </div>
      <div className="reveal">
        <FeaturesBar />
      </div>

      {/* floating demo button to app */}
      <button
        onClick={() => navigate("/app/start")}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-prime-pink to-prime-pinkdeep px-5 py-3 text-sm font-bold text-white shadow-[0_10px_30px_-5px_rgba(236,72,153,0.6)] transition-transform hover:scale-105"
      >
        <Icon name="Smartphone" size={18} />
        Ver o app
      </button>
    </div>
  );
};

export default LandingPage;
