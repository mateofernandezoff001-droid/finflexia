import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Wallet, BarChart3, BrainCircuit, Globe, Zap, Shield } from "lucide-react";
import { PublicLayout } from "@/src/components/layout/PublicLayout";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-32 relative">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#635bff]/10 text-[#635bff] border border-[#635bff]/20 backdrop-blur-sm">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Next-Gen Intelligence</span>
            </div>
            
            <h1 className="text-6xl md:text-[7.5rem] font-display font-bold tracking-tighter leading-[0.8] mb-8 text-slate-900 italic">
               Mastering your <span className="text-slate-400 not-italic">financial</span> destiny.
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              A professional terminal built for speed, transparency, and global market visibility. 
              Powered by deep AI metrics and secure data isolation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/login">
              <Button size="lg" className="h-16 px-10 text-sm font-bold uppercase tracking-widest bg-[#635bff] hover:bg-[#635bff]/90 text-white gap-3 rounded-2xl shadow-2xl shadow-[#635bff]/30 transition-all hover:-translate-y-1 active:scale-95">
                {t('nav.get_started')} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-16 px-10 text-sm font-bold uppercase tracking-widest rounded-2xl border-slate-200 hover:bg-slate-50 transition-all bg-white shadow-sm">
                Watch System Demo
            </Button>
          </motion.div>
        </div>

        {/* Dynamic Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 max-w-6xl mx-auto">
          {[
            { icon: Wallet, title: t('features_page.wallets'), desc: t('features_page.wallets_desc'), color: "bg-blue-500" },
            { icon: BarChart3, title: t('features_page.analytics'), desc: t('features_page.analytics_desc'), color: "bg-emerald-500" },
            { icon: BrainCircuit, title: t('features_page.ai'), desc: t('features_page.ai_desc'), color: "bg-purple-500" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              className="p-10 rounded-[2.5rem] bg-white border border-slate-100 group hover:border-[#635bff]/10 hover:shadow-2xl hover:shadow-[#635bff]/5 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#635bff]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#635bff]/10 transition-colors" />
              <div className={cn("w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-10 shadow-lg shadow-current/10", feature.color)}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-slate-900 italic">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              
              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                 Learn More <ArrowRight className="w-3 h-3 text-[#635bff]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Network Section */}
        <div className="mt-40 text-center space-y-16 py-20 bg-slate-50 rounded-[4rem] border border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,#635bff08_0%,transparent_50%)]" />
            <div className="max-w-2xl mx-auto px-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white shadow-sm text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                    <Globe className="w-3 h-3" /> Global Connectivity
                </div>
                <h2 className="text-4xl font-display font-bold text-slate-900 mb-6 italic underline decoration-[#635bff] decoration-4 underline-offset-8">Relational Infrastructure.</h2>
                <p className="text-slate-500 font-medium">Built on a distributed relational backbone, FinFlex ensures sub-millisecond latency for market execution across all major global exchanges.</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-12 px-6 grayscale opacity-30 invert">
                 {/* Mock compliance/partner logos */}
                 <div className="text-2xl font-display font-black tracking-tighter">FINRA</div>
                 <div className="text-2xl font-display font-black tracking-tighter italic">NASDAQ</div>
                 <div className="text-2xl font-display font-black tracking-tighter border-2 border-slate-900 px-1">FDIC</div>
                 <div className="text-2xl font-display font-black tracking-tighter">SWIFT</div>
                 <div className="text-2xl font-display font-black tracking-tighter">NYSE</div>
            </div>
        </div>
      </section>
    </PublicLayout>
  );
}
