import { useState, useRef, useEffect } from "react";
import Icon from "../../Icon";
import { messagesData, TRAINER_IMG } from "../../../mock";

const MensagensTab = () => {
  const [msgs, setMsgs] = useState(messagesData.messages);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMsgs((m) => [...m, { from: "me", text: text.trim(), time }]);
    setText("");
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { from: "personal", text: "Recebido! Vou revisar e te respondo já já 💗", time },
      ]);
    }, 900);
  };

  return (
    <div className="flex h-[560px] flex-col">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
        <img src={TRAINER_IMG} alt="personal" className="h-9 w-9 rounded-full object-cover" />
        <div>
          <p className="text-sm font-bold text-white">{messagesData.personalName}</p>
          <p className="text-[9px] text-emerald-400">● online</p>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3 no-scrollbar">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                m.from === "me"
                  ? "rounded-br-sm bg-gradient-to-r from-prime-pink to-prime-pinkdeep text-white"
                  : "rounded-bl-sm bg-[#1c1b1f] text-white/85"
              }`}
            >
              <p className="text-[11px] leading-snug">{m.text}</p>
              <p className="mt-0.5 text-right text-[8px] opacity-60">{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* input */}
      <form onSubmit={send} className="flex items-center gap-2 border-t border-white/8 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem..."
          className="flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[11px] text-white placeholder:text-white/35 focus:border-prime-pink focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-prime-pink to-prime-pinkdeep text-white"
        >
          <Icon name="Send" size={15} />
        </button>
      </form>
    </div>
  );
};

export default MensagensTab;
