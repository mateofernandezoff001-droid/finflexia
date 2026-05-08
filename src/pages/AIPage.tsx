import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Bot, User, Trash2, BrainCircuit, Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { aiService } from "@/src/services/ai.service";
import { useFinance } from "@/src/hooks/useFinance";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIPage() {
  const { t } = useTranslation();
  const { wallet, transactions } = useFinance();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await aiService.sendMessage(input, messages);
      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Disculpa, he tenido un pequeño error de procesamiento. ¿Podemos intentarlo de nuevo?" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const analyzeFinancials = async () => {
    setIsTyping(true);
    try {
      const insight = await aiService.analyzeSpending(wallet, transactions);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `### 📊 Análisis de Inteligencia Financiera\n\n${insight}` 
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col px-4">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-primary">{t('common.ai_assistant')}</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Powered by Gemini AI Architecture</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] font-bold h-8 rounded-lg border-slate-200 text-slate-500 uppercase tracking-widest gap-2"
                onClick={() => setMessages([])}
            >
                <Trash2 className="w-3 h-3" /> Clear
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                className="text-[10px] font-bold h-8 rounded-lg border-accent/20 text-accent uppercase tracking-widest gap-2 hover:bg-accent/5"
                onClick={analyzeFinancials}
            >
                <Activity className="w-3 h-3" /> Smart Analysis
            </Button>
        </div>
      </header>

      <Card className="flex-1 border-none shadow-xl bg-white overflow-hidden flex flex-col mb-4">
        <CardContent className="flex-1 p-0 flex flex-col min-h-0 bg-slate-50/20">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6" ref={scrollRef}>
              {messages.length === 0 && (
                <div className="h-full py-20 flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-3xl bg-accent/5 flex items-center justify-center relative">
                        <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                    </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-lg text-primary">Inteligencia Financiera Activa</h3>
                    <p className="text-sm text-slate-400">Pregúntame sobre tus gastos, inversiones o pide consejos para ahorrar.</p>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2",
                  m.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                    m.role === 'user' ? "bg-primary text-white border-primary" : "bg-white text-accent border-slate-100 shadow-sm"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none shadow-md shadow-primary/10" 
                        : "bg-white text-primary rounded-tl-none font-medium shadow-sm border border-slate-50"
                  )}>
                    <div className="markdown-body prose prose-sm max-w-none">
                      <ReactMarkdown>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4 text-accent animate-bounce" />
                  </div>
                  <div className="bg-white/50 px-4 py-2 rounded-full flex gap-1">
                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-6 bg-white border-t border-slate-50">
          <div className="flex w-full gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 focus-within:border-accent/30 transition-all">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hazme una pregunta financiera..."
              className="border-none bg-transparent focus-visible:ring-0 text-sm h-10 shadow-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button 
                onClick={handleSend} 
                className="bg-accent hover:bg-accent/90 text-white rounded-xl w-10 h-10 p-0 shrink-0 shadow-lg shadow-accent/20" 
                disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
