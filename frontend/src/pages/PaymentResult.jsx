import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Icon from "../components/Icon";
import PeachLogo from "../components/PeachLogo";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const STATES = {
  paid: {
    icon: "CheckCircle2",
    color: "text-emerald-400",
    title: "Pagamento aprovado!",
    text: "Bem-vinda ao Glúteo Prime! Seu acesso já está liberado.",
  },
  pending: {
    icon: "Clock",
    color: "text-prime-gold",
    title: "Pagamento em processamento",
    text: "Se você pagou com Pix ou boleto, o acesso será liberado assim que o pagamento for confirmado.",
  },
  failed: {
    icon: "XCircle",
    color: "text-red-400",
    title: "Pagamento não concluído",
    text: "O pagamento não foi aprovado. Você pode tentar novamente.",
  },
  loading: {
    icon: "Loader2",
    color: "text-prime-pink",
    title: "Confirmando seu pagamento...",
    text: "Aguarde um instante enquanto verificamos com o Mercado Pago.",
  },
};

const PaymentResult = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ref = params.get("ref");
  const paymentId = params.get("payment_id") || params.get("collection_id");
  const [tx, setTx] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let tries = 0;
    let timer;
    const check = async () => {
      try {
        const q = new URLSearchParams();
        if (ref) q.set("external_reference", ref);
        if (paymentId) q.set("payment_id", paymentId);
        const { data } = await axios.get(`${BACKEND_URL}/api/payments/verify?${q.toString()}`);
        setTx(data);
        const s = data.status === "paid" ? "paid" : data.status === "pending" ? "pending" : data.status === "failed" ? "failed" : "pending";
        setState(s);
        // keep polling a few times if still pending (webhook may arrive)
        if (s === "pending" && tries < 4) {
          tries += 1;
          timer = setTimeout(check, 4000);
        }
      } catch (e) {
        setState("failed");
      }
    };
    if (ref || paymentId) check();
    else setState("failed");
    return () => clearTimeout(timer);
  }, [ref, paymentId]);

  const view = STATES[state];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-prime-dark px-4 text-white">
      <div className="pointer-events-none fixed -left-40 top-10 h-96 w-96 rounded-full bg-prime-pink/10 blur-[120px]" />
      <div className="pointer-events-none fixed right-0 top-40 h-96 w-96 rounded-full bg-prime-gold/10 blur-[120px]" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-[#151316] to-[#0d0c0e] p-8 text-center">
        <div className="mb-4 flex justify-center">
          <PeachLogo size={44} />
        </div>
        <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ${view.color}`}>
          <Icon name={view.icon} size={34} className={state === "loading" ? "animate-spin" : ""} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-white">{view.title}</h1>
        <p className="mt-2 text-sm text-white/60">{view.text}</p>

        {tx && (
          <div className="mt-5 space-y-2 rounded-xl border border-white/8 bg-black/30 p-4 text-left">
            <Row label="Plano" value={tx.title} />
            <Row label="Valor" value={`R$ ${Number(tx.amount).toFixed(2).replace(".", ",")}`} />
            {tx.payment_type && <Row label="Forma de pagamento" value={tx.payment_type} />}
            <Row label="Status" value={tx.status} />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {state === "paid" && (
            <button
              onClick={() => navigate(`/app/${tx?.plan_id || "start"}`)}
              className="w-full rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white transition-transform hover:scale-[1.02]"
            >
              Acessar meus treinos
            </button>
          )}
          {state === "failed" && tx && (
            <button
              onClick={() => navigate(`/contratar/${tx.plan_id || "start"}`)}
              className="w-full rounded-xl bg-gradient-to-r from-prime-pink to-prime-pinkdeep py-3 text-sm font-extrabold text-white transition-transform hover:scale-[1.02]"
            >
              Tentar novamente
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-xl border border-white/10 py-3 text-sm font-bold text-white/60 transition-colors hover:border-white/25 hover:text-white"
          >
            Voltar ao site
          </button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-[12px] text-white/55">{label}</span>
    <span className="text-[12px] font-bold capitalize text-white">{value}</span>
  </div>
);

export default PaymentResult;
