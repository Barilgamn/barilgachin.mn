import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Phone,
  MessageSquare,
  Bot,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { EMAIL, PHONE } from '../lib/contact';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRFQ?: () => void;
  onOpenCalculator?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'agent';
  text: string;
  time: string;
  action?: {
    label: string;
    type: 'rfq' | 'calculator' | 'call';
  };
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  isOpen,
  onClose,
  onOpenRFQ,
  onOpenCalculator,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text:
        'Сайн байна уу. Энэ бол автомат туслах — хүргэлт, үнэ, стандартын ' +
        'талаарх түгээмэл асуултад хариулна. Нарийн зүйл асуух бол ' +
        `${PHONE.display} дугаар руу залгаарай.`,
      time: 'Яг одоо',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState('');
  const [isCallbackSent, setIsCallbackSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickQuestions = [
    'Хүргэлтийн хөлс хэд вэ?',
    'Бөөний үнэ хэрхэн тогтдог вэ?',
    'MNS стандарт, гэрчилгээ',
    'Төслийн үнийн санал авах',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let action: ChatMessage['action'] = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('тээвэр') || lower.includes('кран') || lower.includes('хүргэлт')) {
        // Эдгээр дүн нь create_order-ийн delivery_fee_for-той яг таарна.
        reply =
          'Хүргэлтийн хөлс ачааны жингээр тогтоогдоно: 50кг хүртэл 10,000₮, ' +
          '1.2 тонн хүртэл 35,000₮, 3.5 тонн хүртэл 65,000₮, 6 тонн хүртэл ' +
          '120,000₮, түүнээс дээш 220,000₮. Сагсандаа бараагаа хийхэд яг ' +
          'хэдэн төгрөг болохыг харуулна. Агуулахаас өөрөө ачих бол хөлсгүй.';
      } else if (lower.includes('цемент') || lower.includes('блок') || lower.includes('мак')) {
        reply =
          'Бөөний үнэ бараа тус бүрдээ өөр шатлалтай. Барааны дэлгэрэнгүй ' +
          'хуудсан дээр хэдэн ширхэгээс ямар үнэ болохыг жагсаалтаар харуулсан ' +
          'байгаа. Их хэмжээний татан авалт бол үнийн санал авах нь зүйтэй.';
      } else if (lower.includes('арматур') || lower.includes('стандарт') || lower.includes('mns')) {
        reply =
          'Стандарт бүхий бараан дээр MNS тэмдэглэгээ, дугаарыг нь барааны ' +
          'хуудсан дээр бичсэн байгаа. Тодорхой барааны чанарын гэрчилгээ ' +
          'шаардлагатай бол урьдчилж хэлнэ үү, бэлтгэж өгнө.';
      } else if (lower.includes('үнийн санал') || lower.includes('rfq') || lower.includes('төсөл')) {
        reply =
          'Төслийн хэмжээний татан авалтад бөөний үнийн санал гаргаж өгнө. ' +
          `Материалын жагсаалтаа ${EMAIL.sales} хаяг руу илгээх эсвэл ` +
          `${PHONE.display} дугаар руу залгаарай.`;
        action = { label: `${PHONE.display} руу залгах`, type: 'call' };
      } else {
        reply =
          'Энэ асуултад би хариулж чадахгүй байна. Манай борлуулалтын ' +
          `багтай ${PHONE.display} дугаараар холбогдоход шуурхай хариу өгнө.`;
        action = { label: `${PHONE.display} руу залгах`, type: 'call' };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    setIsCallbackSent(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'agent',
          text: `Баярлалаа! Таны ${callbackPhone} дугаарт манай барилгын материалын инженер 5-10 минутад холбогдож зөвлөгөө өгөх болно.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white w-full sm:max-w-md h-[92vh] sm:h-[620px] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">Barilgachin туслах</h3>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-600">
                  Автомат
                </span>
              </div>
              <p className="text-xs text-slate-400">Хүн биш — түгээмэл асуултад хариулна</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a
              href={PHONE.href}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
              title="Шууд залгах"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Phone Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-slate-800 shrink-0">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Шуурхай лавлах утас:</span>
          </div>
          <a
            href={PHONE.href}
            className="font-black text-amber-700 hover:underline flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            <span>{PHONE.display}</span>
          </a>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-2xs">
                    Б
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      {msg.action.type === 'rfq' && onOpenRFQ && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenRFQ();
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {msg.action.label}
                        </button>
                      )}
                      {msg.action.type === 'call' && (
                        <a
                          href={PHONE.href}
                          className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {msg.action.label}
                        </a>
                      )}
                    </div>
                  )}
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      isUser ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 text-xs font-bold">
                Б
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3 shadow-2xs">
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
          <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Түгээмэл асуултууд:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-slate-950 text-slate-700 transition-colors whitespace-nowrap shrink-0 border border-slate-200/80 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Callback request input row */}
        {!isCallbackSent ? (
          <form
            onSubmit={handleCallbackSubmit}
            className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-xs shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="tel"
              placeholder="Утсаа үлдээж залгалт авах (8811...)"
              value={callbackPhone}
              onChange={(e) => setCallbackPhone(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-slate-800 placeholder:text-slate-600 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!callbackPhone.trim()}
              className="px-3 py-1 btn-liquid-dark disabled:opacity-40 text-white rounded-lg text-[11px] font-bold cursor-pointer"
            >
              Залгуулах
            </button>
          </form>
        ) : (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-medium flex items-center gap-1.5 border-t border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Утасны дугаар бүртгэгдлээ. Бид тун удахгүй холбогдоно.</span>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Асуултаа энд бичнэ үү..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-100 text-slate-900 rounded-xl border border-transparent focus:border-slate-900 focus:bg-white focus:outline-hidden"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl btn-liquid-dark disabled:opacity-40 text-white font-bold cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
