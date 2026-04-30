import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot } from 'lucide-react';

interface ChatPanelProps {
  isChatOpen: boolean;
  setIsChatOpen: (v: boolean) => void;
  chatInput: string;
  setChatInput: (v: string) => void;
  chatMessages: { role: string; text: string }[];
  isChatting: boolean;
  handleSendMessage: () => void;
}

export function ChatPanel({ isChatOpen, setIsChatOpen, chatInput, setChatInput, chatMessages, isChatting, handleSendMessage }: ChatPanelProps) {
  return (
    <AnimatePresence>
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="bg-white rounded-t-3xl w-full max-w-md h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Bot className="w-5 h-5 text-teal-500" /> Trợ Lý AI Hẹn Hò</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>{msg.text}</div>
                </div>
              ))}
              {isChatting && <div className="flex"><div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-slate-500 animate-pulse">Đang suy nghĩ...</div></div>}
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-2">
              <input aria-label="Tin nhắn cho AI" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Nhắn gì đó cho AI..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20" />
              <button onClick={handleSendMessage} disabled={isChatting || !chatInput.trim()} className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors"><Send className="w-5 h-5" /></button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
