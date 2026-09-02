import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import Icon from "../Icon";
import { useToast } from "../../hooks/use-toast";

const Field = ({ icon, ...props }) => (
  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 focus-within:border-prime-pink">
    <Icon name={icon} size={16} className="text-white/40" />
    <input
      {...props}
      className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/35 focus:outline-none"
    />
  </div>
);

const LoginModal = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      toast({ title: "Preencha todos os campos para continuar." });
      return;
    }
    try {
      localStorage.setItem(
        "gluteoprime_user",
        JSON.stringify({ name: form.name || "Aluna Prime", email: form.email })
      );
    } catch (_) {}
    onOpenChange(false);
    toast({
      title: mode === "login" ? "Login realizado! (demonstração)" : "Conta criada! (demonstração)",
      description: "Bem-vinda ao Glúteo Prime 💗",
    });
    setTimeout(() => navigate("/app/start"), 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/10 bg-prime-card text-white">
        <DialogTitle className="sr-only">Entrar ou criar conta</DialogTitle>
        <DialogDescription className="sr-only">Acesse sua conta Glúteo Prime</DialogDescription>

        <div className="text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-prime-pink/15 text-prime-pink">
            <Icon name="UserRound" size={20} />
          </span>
          <h3 className="mt-2 font-display text-xl font-extrabold text-white">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h3>
          <p className="text-[12px] text-white/55">Acesse sua área de treinos</p>
        </div>

        <div className="flex rounded-xl bg-black/40 p-1">
          {[
            { id: "login", label: "Entrar" },
            { id: "signup", label: "Criar conta" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                mode === m.id
                  ? "bg-gradient-to-r from-prime-pink to-prime-pinkdeep text-white"
                  : "text-white/50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <Field icon="User" placeholder="Seu nome" value={form.name} onChange={set("name")} />
          )}
          <Field icon="Mail" type="email" placeholder="Seu e-mail" value={form.email} onChange={set("email")} />
          <Field icon="Lock" type="password" placeholder="Sua senha" value={form.password} onChange={set("password")} />
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white transition-transform hover:scale-[1.02]"
          >
            {mode === "login" ? "Entrar" : "Criar minha conta"}
          </button>
        </form>

        <p className="flex items-center justify-center gap-1.5 text-[10px] text-white/40">
          <Icon name="ShieldCheck" size={12} className="text-emerald-400" />
          Seus dados protegidos · demonstração
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
