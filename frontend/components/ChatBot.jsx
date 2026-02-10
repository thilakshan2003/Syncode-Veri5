"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', content: 'Hello! I am Veri5 AI. How can I help you today with your sexual health and wellness questions?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const quickActions = [
        { label: 'What is PRP?', query: 'Tell me about PRP treatment.' },
        { label: 'Safe Sex Tips', query: 'What are some essential safe sex tips?' },
        { label: 'Clinic Locations', query: 'How can I find clinic locations near me?' }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (query = input) => {
        if (!query.trim()) return;

        const newMessages = [...messages, { role: 'user', content: query }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            });

            const data = await response.json();
            if (data.success) {
                setMessages(prev => [...prev, { role: 'model', content: data.message }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'model', content: "Something went wrong. Please check your connection." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'model', content: 'Chat history cleared. How else can I help you?' }]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Launcher - Only visible when closed */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 bg-[#28A99E] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#208d83] transition-colors"
                    >
                        <MessageCircle className="w-7 h-7" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Modal Overlay and Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
                        />

                        {/* Chat Window - Centered */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[500px] h-[700px] max-h-[85vh] flex flex-col bg-[#0F172A] border border-[#1E293B] rounded-[2rem] shadow-2xl overflow-hidden z-[101]"
                        >
                            {/* Header */}
                            <div className="p-5 bg-[#1E293B]/50 border-b border-[#1E293B] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#28A99E]/20 rounded-xl flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-[#28A99E]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#F8FAFC]">Veri5 AI Support</h3>
                                        <span className="text-[10px] text-[#28A99E] flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-[#28A99E] rounded-full animate-pulse"></span>
                                            Online & Helping
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Chat" className="text-slate-400 hover:text-white hover:bg-white/5">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5">
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-3">
                                <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-[11px] text-amber-500 leading-normal font-medium">
                                    <strong>DISCLAIMER:</strong> Veri5 AI is an educational healthcare tool. It cannot provide medical diagnosis or treatment. Always consult a qualified doctor for clinical advice.
                                </p>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-[#0B1120]/30">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-[1.25rem] px-5 py-3 text-sm leading-relaxed shadow-lg ${msg.role === 'user'
                                                ? 'bg-[#2563EB] text-white rounded-br-none font-medium'
                                                : 'bg-[#1E293B] text-slate-200 border border-slate-700/50 rounded-bl-none'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex justify-start"
                                    >
                                        <div className="bg-[#1E293B] rounded-[1.25rem] px-5 py-4 flex items-center gap-2 border border-slate-700/50 rounded-bl-none">
                                            <div className="flex gap-1.5">
                                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1] }} className="w-2 h-2 bg-[#28A99E] rounded-full"></motion.span>
                                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1], delay: 0.2 }} className="w-2 h-2 bg-[#28A99E] rounded-full"></motion.span>
                                                <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1], delay: 0.4 }} className="w-2 h-2 bg-[#28A99E] rounded-full"></motion.span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Actions */}
                            <div className="px-5 py-3 border-t border-[#1E293B] bg-[#0F172A]/80 backdrop-blur-md">
                                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                                    {quickActions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSend(action.query)}
                                            className="whitespace-nowrap px-4 py-2 rounded-xl bg-[#1E293B] border border-slate-700 text-[12px] text-slate-300 hover:bg-[#28A99E] hover:border-[#28A99E] hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-5 bg-[#1E293B]/20 border-t border-[#1E293B]">
                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                    className="relative flex items-center gap-3"
                                >
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your health specific question..."
                                        className="flex-1 bg-[#0F172A] border border-[#1E293B] rounded-2xl px-5 py-4 text-sm text-[#F8FAFC] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#28A99E]/50 focus:border-[#28A99E] transition-all shadow-inner"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isTyping}
                                        className="w-12 h-12 bg-[#28A99E] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#28A99E]/20 hover:bg-[#208d83] hover:shadow-[#208d83]/30 disabled:opacity-50 disabled:bg-slate-700 disabled:shadow-none transition-all duration-300 group"
                                    >
                                        <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
