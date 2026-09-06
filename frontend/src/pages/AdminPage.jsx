import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Icon from "../components/Icon";
import PeachLogo from "../components/PeachLogo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/use-toast";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const StatCard = ({ icon, label, value, accent }) => (
  <div className="rounded-2xl border border-white/8 bg-gradient-to-b from-[#151316] to-[#0d0c0e] p-5">
    <div className="flex items-center justify-between">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon name={icon} size={18} />
      </span>
    </div>
    <p className="mt-3 font-display text-3xl font-extrabold text-white">{value}</p>
    <p className="text-[11px] tracking-wide text-white/50">{label}</p>
  </div>
);

const AdminLogin = ({ onDone }) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      if (!u.is_admin) {
        toast({ title: "Esta conta não é administradora." });
        return;
      }
      onDone();
    } catch (err) {
      toast({ title: err?.response?.data?.detail || "Falha no login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-prime-dark px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-white/10 bg-prime-card p-8">
        <div className="mb-4 flex flex-col items-center">
          <PeachLogo size={44} />
          <h1 className="mt-2 font-display text-xl font-extrabold text-white">Painel Admin</h1>
          <p className="text-[11px] text-white/50">Acesso restrito</p>
        </div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="E-mail admin"
          className="mb-3 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white placeholder:text-white/35 focus:border-prime-pink focus:outline-none" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Senha"
          className="mb-4 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white placeholder:text-white/35 focus:border-prime-pink focus:outline-none" />
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white disabled:opacity-60">
          {loading && <Icon name="Loader2" size={15} className="animate-spin" />} Entrar
        </button>
      </form>
    </div>
  );
};

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, token, loading, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("dash");
  const [err, setErr] = useState(false);

  const isAdmin = isAuthenticated && user?.is_admin;

  const loadData = async () => {
    setErr(false);
    try {
      const t = localStorage.getItem("gluteoprime_token");
      const h = { headers: { Authorization: `Bearer ${t || token}` } };
      const [s, u] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/stats`, h),
        axios.get(`${BACKEND_URL}/api/admin/users`, h),
      ]);
      setStats(s.data);
      setUsers(u.data);
    } catch (e) {
      setErr(true);
    }
  };

  useEffect(() => {
    if (isAdmin) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, token]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-prime-dark text-white/60">Carregando...</div>;
  }
  if (!isAdmin) {
    return <AdminLogin onDone={loadData} />;
  }

  return (
    <div className="min-h-screen bg-prime-dark text-white">
      <header className="flex items-center justify-between border-b border-white/6 px-4 py-4 md:px-8">
        <div className="flex items-center gap-2">
          <PeachLogo size={34} />
          <span className="font-display text-lg font-extrabold text-white">Admin<span className="text-pink-gradient">Prime</span></span>
        </div>
        <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-1.5 text-[12px] text-white/60 hover:text-white">
          <Icon name="LogOut" size={14} /> Sair
        </button>
      </header>

      <div className="mx-auto max-w-[1100px] px-4 py-6 md:px-8">
        <div className="mb-5 flex gap-2">
          {[{ id: "dash", label: "Dashboard" }, { id: "users", label: "Usuárias" }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold ${tab === t.id ? "bg-gradient-to-r from-prime-pink to-prime-pinkdeep text-white" : "border border-white/10 text-white/55"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {err && <p className="text-sm text-red-400">Erro ao carregar dados.</p>}

        {tab === "dash" && stats && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard icon="Users" label="Usuárias totais" value={stats.total_users} accent="bg-prime-pink/15 text-prime-pink" />
            <StatCard icon="Crown" label="Premium ativas" value={stats.premium_users} accent="bg-prime-gold/15 text-prime-gold" />
            <StatCard icon="Dumbbell" label="Treinos hoje" value={stats.sessions_today} accent="bg-prime-pink/15 text-prime-pink" />
            <StatCard icon="TrendingUp" label="Treinos totais" value={stats.total_sessions} accent="bg-emerald-500/15 text-emerald-400" />
            <StatCard icon="UserPlus" label="Novas (24h)" value={stats.new_users_24h} accent="bg-prime-pink/15 text-prime-pink" />
            <StatCard icon="CreditCard" label="Assinaturas ativas" value={stats.active_subscriptions} accent="bg-prime-gold/15 text-prime-gold" />
            <StatCard icon="DollarSign" label="Receita (R$)" value={Number(stats.revenue_total).toFixed(2).replace(".", ",")} accent="bg-emerald-500/15 text-emerald-400" />
            <StatCard icon="Receipt" label="Pagamentos" value={stats.paid_transactions} accent="bg-white/10 text-white/70" />
          </div>
        )}

        {tab === "users" && (
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#131215]">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-black/30 text-white/50">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3">Plano</th>
                  <th className="px-4 py-3">Objetivo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-white/5">
                    <td className="px-4 py-3 font-semibold text-white">{u.name}</td>
                    <td className="px-4 py-3 text-white/60">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${u.plan === "premium" ? "bg-prime-gold/15 text-prime-gold" : "bg-white/10 text-white/60"}`}>
                        {u.plan}{u.is_admin ? " · admin" : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60">{u.goal || "—"}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-white/40">Nenhuma usuária ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
