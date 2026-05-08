import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { BrainCircuit, Zap, Wallet, BarChart3, TrendingUp, ShieldCheck, Cpu, Globe, Sparkles } from "lucide-react";
import { PublicLayout } from "@/src/components/layout/PublicLayout";
import { useEffect, useState } from "react";
import { generateFinancialInsight } from "@/src/services/ai.service";

export function FeaturesPage() {
  const { t } = useTranslation();
  const [insight, setInsight] = useState("Synchronizing neural weights for predictive market modeling...");

  useEffect(() => {
    generateFinancialInsight("Modern Financial Features and User Experience").then(setInsight);
  }, []);

  const features = [
    { icon: BrainCircuit, title: t('features_page.ai'), desc: t('features_page.ai_desc'), color: "bg-blue-500" },
    { icon: Zap, title: t('features_page.trading'), desc: t('features_page.trading_desc'), color: "bg-amber-500" },
    { icon: Wallet, title: t('features_page.wallets'), desc: t('features_page.wallets_desc'), color: "bg-emerald-500" },
    { icon: BarChart3, title: t('features_page.analytics'), desc: t('features_page.analytics_desc'), color: "bg-purple-500" },
    { icon: TrendingUp, title: "Market Simulation", desc: "Hyper-realistic asset price movements with low-latency updates.", color: "bg-indigo-500" },
    { icon: ShieldCheck, title: "Secure Terminal", desc: "Military-grade encryption for all financial operations and logs.", color: "bg-rose-500" },
    { icon: Cpu, title: "Edge Processing", desc: "Data processing handled locally for maximum speed and privacy.", color: "bg-slate-500" },
    { icon: Globe, title: "Global Access", desc: "Compliant with international standards for digital asset management.", color: "bg-cyan-500" }
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              {t('features_page.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('features_page.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-current/10`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 p-12 rounded-[32px] bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,#635bff44_0%,transparent_50%)]" />
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-4">
                        <Sparkles className="w-3 h-3" /> Live Feature Narrative
                    </div>
                    <h2 className="text-4xl font-display font-bold mb-6">Built for the next generation of financial pioneers.</h2>
                    <p className="text-slate-400 mb-8 italic">"{insight}"</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#635bff] flex items-center justify-center font-bold">M</div>
                        <div>
                            <div className="font-bold">Mateo Fernandez</div>
                            <div className="text-xs text-slate-500">Chief Architect, FinFlex Pro</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-sm border border-white/10 font-mono text-xs space-y-4">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-500">SYSTEM_READY</span>
                        <span className="text-emerald-400">0.002ms</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-500">NETWORK_LATENCY</span>
                        <span className="text-amber-400">12ms</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-slate-500">AI_CORE_LOAD</span>
                        <span className="text-emerald-400">OPTIMAL</span>
                    </div>
                    <div className="pt-4 text-emerald-400 animate-pulse">
                        &gt; INITIALIZING SECURE_TRANSPORT_PROTOCOL...
                        <br />
                        &gt; ESTABLISHING RELATIONAL_DATA_SYNC...
                        <br />
                        &gt; ENCRYPTING_USER_PAYLOAD...
                    </div>
                </div>
            </div>
        </div>
      </div>
    </PublicLayout>
  );
}
