import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: "Kon\'nichiwa! I\'m Akiba-chan, your AI assistant. Need help finding the perfect figure or tracking an order?" }] }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages }),
      });

      const data = await response.json();
      if (data.text) {
        setMessages([...newMessages, { role: 'model', parts: [{ text: data.text }] }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'model', parts: [{ text: "Gomen! My uplink is failing. Please try again later." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-14 h-14 bg-neon-purple rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(188,19,254,0.6)] border border-white/20 transition-all",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageSquare className="text-white w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] md:w-[400px] h-[500px] glass rounded-2xl flex flex-col overflow-hidden border border-neon-purple/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-4 bg-neon-purple/20 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-neon-purple flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">Akiba AI Assistant</h3>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1.5" />
                    <span className="text-[10px] text-white/50 uppercase tracing-widest">Systems Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-cyber-black/50">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "flex max-w-[80%] items-start space-x-2",
                    msg.role === 'user' && "flex-row-reverse space-x-reverse"
                  )}>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                      msg.role === 'user' ? "bg-neon-cyan" : "bg-neon-purple"
                    )}>
                      {msg.role === 'user' ? <User className="w-3 h-3 text-black" /> : <Bot className="w-3 h-3 text-white" />}
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-neon-cyan text-black rounded-tr-none" 
                        : "bg-white/10 text-white rounded-tl-none border border-white/5"
                    )}>
                      {msg.parts[0].text}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-neon-purple" />
                    <span className="text-xs text-white/50">Computing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-cyber-gray/80 border-t border-white/10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about figures..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-neon-purple transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 bg-neon-purple text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(188,19,254,0.5)] transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
