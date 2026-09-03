import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Icon from "../components/Icon";
import PeachLogo from "../components/PeachLogo";
import { plans } from "../mock";
import { useToast } from "../hooks/use-toast";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const PERIOD_KEYS = ["mensal", "trimestral", "semestral", "anual"];

const Checkout = () => {
  const { plan: planId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const plan = plans.find((p) => p.id === planId) || plans[0];

  const [mode, setMode] = useState("signup");
  const [selectedIdx, setSelectedIdx] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const selected = plan.pricing[selectedIdx];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || (mode === "signup" && !form.name)) {
      toast({ title: "Preencha nome e e-mail para continuar." });
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/payments/checkout`, {
        plan_id: plan.id,
        period: PERIOD_KEYS[selectedIdx],
        email: form.email,
        name: form.name,
        origin: window.location.origin,
      });
      if (data.checkout_url) {
        // Redirect to Mercado Pago hosted checkout (card, Pix, boleto)
        window.location.href = data.checkout_url;
      } else {
        throw new Error("no checkout url");
      }
    } catch (err) {
      setLoading(false);
      toast({
        title: "Não foi possível iniciar o pagamento",
        description: "Tente novamente em instantes.",
      });
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-prime-dark text-white">
      <div className="pointer-events-none fixed -left-40 top-10 h-96 w-96 rounded-full bg-prime-pink/10 blur-[120px]" />
      <div className="pointer-events-none fixed right-0 top-40 h-96 w-96 rounded-full bg-prime-gold/10 blur-[120px]" />

      <header className="relative border-b border-white/6 px-4 py-4 md:px-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <PeachLogo size={38} />
          <span className="font-display text-lg font-extrabold text-pink-gradient">PRIME</span>
        </button>
      </header>

      <div className="relative mx-auto grid max-w-[980px] grid-cols-1 gap-6 px-4 py-10 md:px-8 lg:grid-cols-2">
        {/* auth card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#151316] to-[#0d0c0e] p-6 md:p-8">
          <button
            onClick={() => navigate("/")}
            className="mb-4 flex items-center gap-1.5 text-[12px] text-white/55 hover:text-white"
          >
            <Icon name="ArrowLeft" size={14} /> Voltar
          </button>
          <h1 className="font-display text-2xl font-extrabold text-white">
            {mode === "signup" ? "Crie sua conta" : "Entrar"}
          </h1>
          <p className="mt-1 text-sm text-white/55">
            Falta pouco para começar sua transformação.
          </p>

          <div className="mt-5 flex rounded-xl bg-black/40 p-1">
            {[
              { id: "signup", label: "Criar conta" },
              { id: "login", label: "Já tenho conta" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  mode === m.id ? "bg-gradient-to-r from-prime-pink to-prime-pinkdeep text-white" : "text-white/50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            {mode === "signup" && (
              <Field icon="User" placeholder="Seu nome" value={form.name} onChange={set("name")} />
            )}
            <Field icon="Mail" type="email" placeholder="Seu e-mail" value={form.email} onChange={set("email")} />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3.5 text-sm font-extrabold text-white transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" /> Redirecionando...
                </>
              ) : (
                <>
                  <Icon name="Lock" size={15} /> Ir para o pagamento
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="rounded bg-white/5 px-2 py-1 text-[9px] font-bold text-white/60">CARTÃO</span>
              <span className="rounded bg-white/5 px-2 py-1 text-[9px] font-bold text-white/60">PIX</span>
              <span className="rounded bg-white/5 px-2 py-1 text-[9px] font-bold text-white/60">BOLETO</span>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-white/45">
              <Icon name="ShieldCheck" size={13} className="text-emerald-400" />
              Pagamento seguro via Mercado Pago · 7 dias de garantia
            </p>
          </form>
        </div>

        {/* summary card */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#151316] to-[#0d0c0e] p-6 md:p-8">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-4xl font-extrabold text-pink-gradient">{plan.name}</h2>
            <Icon name={plan.icon} size={22} className="text-prime-pink" />
            <span className="ml-auto rounded-md bg-prime-gold/15 px-2 py-1 text-[11px] font-bold text-prime-gold">
              {plan.discount}
            </span>
          </div>
          <p className="mt-1 text-xs font-bold tracking-wide text-white/60">{plan.subtitle}</p>

          <p className="mt-5 text-[11px] font-bold tracking-widest text-white/45">ESCOLHA A DURAÇÃO</p>
          <div className="mt-2 space-y-2">
            {plan.pricing.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                  selectedIdx === i ? "border-prime-pink bg-prime-pink/10" : "border-white/10 hover:border-white/25"
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-white">{p.period}</p>
                  <p className="text-[10px] text-white/45">
                    <span className="line-through">{p.old}</span> {p.perMonth || ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-prime-gold/15 px-1.5 py-0.5 text-[9px] font-bold text-prime-gold">
                    {p.extra}
                  </span>
                  <span className="font-display text-base font-extrabold text-white">{p.price}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
            <span className="text-sm font-medium text-white/60">Total</span>
            <span className="font-display text-2xl font-extrabold text-gold-gradient">
              {selected.price}
              <span className="text-xs font-medium text-white/50">{selected.unit}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ icon, ...props }) => (
  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 focus-within:border-prime-pink">
    <Icon name={icon} size={16} className="text-white/40" />
    <input
      {...props}
      className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/35 focus:outline-none"
    />
  </div>
);

export default Checkout;
