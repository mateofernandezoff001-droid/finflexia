import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Users, Rocket, Target, Mail, MapPin, ExternalLink, MessageSquare, Info, Sparkles } from "lucide-react";
import { PublicLayout } from "@/src/components/layout/PublicLayout";
import { useEffect, useState } from "react";
import { generateFinancialInsight } from "@/src/services/ai.service";

export function CompanyPage() {
  const { t } = useTranslation();
  const [insight, setInsight] = useState("Analyzing market vectors for decentralized settlement...");

  useEffect(() => {
    generateFinancialInsight("Company Future and Global Markets").then(setInsight);
  }, []);

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 bg-gradient-to-br from-slate-900 to-slate-500 bg-clip-text text-transparent italic">
              Empowering global wealth.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              {t('company_page.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Mission / Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-32">
            <div className="p-12 rounded-[2.5rem] bg-[#635bff] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[80px] -mr-16 -mt-16 group-hover:bg-white/20 transition-all duration-700" />
                <Target className="w-12 h-12 mb-8 opacity-50" />
                <h2 className="text-4xl font-display font-bold mb-6 italic">{t('company_page.mission')}</h2>
                <p className="text-lg text-slate-100 leading-relaxed">
                    {t('company_page.mission_desc')}
                </p>
            </div>
            <div className="p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 relative overflow-hidden group">
                <Rocket className="w-12 h-12 mb-8 text-[#635bff] opacity-50" />
                <h2 className="text-4xl font-display font-bold mb-6 text-slate-900 italic">2026 Roadmap</h2>
                <p className="text-lg text-slate-500 leading-relaxed">
                    {t('company_page.roadmap_desc')}
                </p>
                <div className="mt-8 space-y-3">
                    {['Cross-chain Settlements', 'AI Portfolio Balancing', 'Global IBAN Issuance'].map(item => (
                        <div key={item} className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Dynamic AI Section */}
        <div className="mb-32">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
                <div className="max-w-xl">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#635bff] uppercase tracking-[0.2em] mb-4">
                        <Info className="w-4 h-4" /> Real-time Platform Insight
                    </div>
                    <h3 className="text-4xl font-display font-bold text-slate-900">Dynamic AI Summary</h3>
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em]">UPDATED AT {new Date().toLocaleTimeString()}</div>
            </div>

            <div className="p-10 rounded-[2.5rem] border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-1 space-y-6">
                        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 italic font-display text-amber-900 text-sm shadow-sm">
                            "{insight}"
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-display italic">AI</div>
                            <div>
                                <div className="text-xs font-bold text-slate-900">System Intelligence</div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Gemini 1.5 Architecture</div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-6 text-slate-500 leading-relaxed font-medium">
                        <p>Our platform was born from a simple observation: mid-market users are underserved by tools that are either too primitive for professional needs or too complex for accessible wealth growth. We bridged this gap by combining modular SQLite/PostgreSQL relational engines with a neural processing layer that interprets market signals in real-time.</p>
                        <p>By 2026, we aim to be the default terminal for "FinTech-First" individuals who demand the same speed and security as institutional trading desks, but within a unified, beautifully crafted mobile and desktop environment.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Contact Section */}
        <div className="grid md:grid-cols-3 gap-8">
            {[
                { icon: MessageSquare, title: 'Support', desc: 'Active 24/7 technical monitoring.', cta: 'Visit Help Center' },
                { icon: Users, title: 'Careers', desc: 'Join the next generation of builders.', cta: 'View Openings' },
                { icon: Mail, title: 'Partnerships', desc: 'Global institutional collaborations.', cta: 'Get in Touch' }
            ].map(item => (
                <div key={item.title} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#635bff]/20 hover:bg-white transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 mb-6">{item.desc}</p>
                    <button className="flex items-center gap-2 text-xs font-bold text-[#635bff] uppercase tracking-widest hover:gap-3 transition-all">
                        {item.cta} <ExternalLink className="w-3 h-3" />
                    </button>
                </div>
            ))}
        </div>
      </div>
    </PublicLayout>
  );
}
