import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Minimize2,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import type { KAKData } from '../../types/kak';
import { sendChatMessage, type ChatMessage } from '../../lib/ai/aiService';

interface Props {
  currentData?: Partial<KAKData>;
}

const QUICK_PROMPTS = [
  {
    label: '💡 Susun Gap Analysis',
    text: 'Bantu saya menyusun narasi Gap Analysis untuk usulan SKP KAK, mencakup isu strategis, kondisi eksisting, target RPJMN 2025-2029, dan kewilayahan.',
  },
  {
    label: '⚖️ Panduan Gender (GAP)',
    text: 'Bagaimana cara mengisi 4 langkah Gender Analysis Pathway (GAP) pada KAK Kemenko PMK? Berikan contoh konkritnya.',
  },
  {
    label: '🛡️ Contoh Manajemen Risiko',
    text: 'Berikan contoh identifikasi peristiwa risiko, penyebab, dampak, dan mitigasi untuk kegiatan rapat koordinasi lintas K/L.',
  },
  {
    label: '📋 Narasi Tahap 1 KAK',
    text: 'Buatkan contoh narasi kalimat pendahuluan untuk Tahap 1: Melaksanakan Identifikasi Permasalahan pada KAK Kemenko PMK.',
  },
];

export const AIChatAssistant: React.FC<Props> = ({ currentData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'Halo! Saya **Asisten AI Digitalisasi KAK** Kemenko PMK. Ada yang bisa saya bantu untuk perumusan dasar hukum, narasi RPJMN, Gap Analysis, GAP Gender, atau Manajemen Risiko KAK Anda?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      textareaRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(messages, text, currentData);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages([...newHistory, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Maaf, terjadi kendala:** ${err?.message || 'Tidak dapat terhubung ke AI. Silakan coba kembali.'}`,
        timestamp: new Date(),
      };
      setMessages([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm('Bersihkan riwayat percakapan dengan AI?')) {
      setMessages([
        {
          id: 'welcome-msg',
          role: 'assistant',
          content:
            'Halo kembali! Riwayat percakapan telah dibersihkan. Apa yang ingin Anda diskusikan terkait dokumen KAK?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Helper formatting markdown sederhana (bold, list, newline)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold handling: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-amber-300">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-200 my-0.5">
            {formattedLine}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="ml-2 font-medium text-slate-200 my-1">
            {formattedLine}
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="my-1 leading-relaxed text-slate-200">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer border border-white/20"
          title="Buka Asisten AI KAK"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
          </div>
          <div className="text-left pr-1">
            <span className="block text-xs font-bold tracking-wide uppercase text-indigo-100 flex items-center gap-1">
              Asisten AI KAK <Sparkles className="w-3.5 h-3.5 text-yellow-300 inline" />
            </span>
            <span className="block text-[11px] text-white/80">Tanya / Buat Narasi</span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[440px] h-[620px] max-h-[85vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/80 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                <Bot className="w-5 h-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Asisten AI KAK
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                    Swift
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Konsultasi & Penulisan Dokumen Kemenko PMK</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Bersihkan Percakapan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                title="Tutup Widget"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/60 overflow-x-auto scrollbar-none flex gap-1.5 items-center">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1 pl-1">
              <Lightbulb className="w-3 h-3 text-amber-400" /> Contoh:
            </span>
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.text)}
                disabled={isLoading}
                className="text-[11px] whitespace-nowrap bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-400/50 text-slate-300 hover:text-indigo-200 border border-slate-700/60 px-2.5 py-1 rounded-full transition-all cursor-pointer disabled:opacity-50"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`relative group max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-sm'
                      : 'bg-slate-800/90 border border-slate-700/70 text-slate-200 rounded-bl-sm'
                  }`}
                >
                  <div className="text-[12.5px] leading-relaxed break-words">
                    {msg.role === 'assistant' ? renderFormattedContent(msg.content) : msg.content}
                  </div>

                  {/* Copy Button for Assistant message */}
                  {msg.role === 'assistant' && (
                    <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex justify-between items-center text-[10px] text-slate-400">
                      <span>Kemenko PMK Assistant</span>
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
                        title="Salin jawaban"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Teks</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 bg-slate-800/60 border border-slate-700/50 rounded-2xl px-3.5 py-2 w-fit">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                <span className="text-xs text-indigo-200">Asisten sedang menyusun jawaban...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800">
            <div className="relative flex items-center bg-slate-800/90 border border-slate-700 rounded-xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pertanyaan atau minta buatkan narasi KAK..."
                rows={1}
                className="flex-1 bg-transparent px-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none resize-none max-h-24 min-h-[40px]"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="m-1.5 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                title="Kirim (Enter)"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex justify-between items-center mt-1.5 px-1 text-[10px] text-slate-500">
              <span>Tekan Enter untuk kirim, Shift+Enter untuk baris baru</span>
              <span className="text-slate-400 font-medium">Model: Swift</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
