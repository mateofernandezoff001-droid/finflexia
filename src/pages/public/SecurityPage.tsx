import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Shield, Lock, Eye, Key, FileCheck, Radar, Server, Wifi } from "lucide-react";
import { PublicLayout } from "@/src/components/layout/PublicLayout";

export function SecurityPage() {
  const { t } = useTranslation();

  const securityMeasures = [
    { icon: Lock, title: t('security_page.jwt'), desc: t('security_page.jwt_desc') },
    { icon: FileCheck, title: t('security_page.audit'), desc: t('security_page.audit_desc') },
    { icon: Radar, title: "Threat Detection", desc: "Real-time monitoring of anomalies and brute-force attempts at the gateway." },
    { icon: Key, title: "CJS Multi-Key", desc: "Hierarchical deterministic key derivation for sensitive API operations." },
    { icon: Eye, title: t('security_page.isolation'), desc: t('security_page.isolation_desc') },
    { icon: Server, title: "Edge Logic", desc: "Business logic validation executed in secure sandboxes before persistence." },
    { icon: Wifi, title: "AES-256 Transport", desc: "End-to-end encryption for all active WebSocket and REST traffic." },
    { icon: Shield, title: "Compliance Ready", desc: "Built with SOC2 and GDPR principles in mind from the first line of code." }
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-widest mb-8 border border-rose-100">
                <Shield className="w-3 h-3" /> Fortress Zero-Trust
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              {t('security_page.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('security_page.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityMeasures.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 flex items-center justify-center mb-6">
                <s.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-slate-900">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 space-y-12">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold mb-4">Infrastructure Integrity</h2>
                <div className="w-20 h-1 bg-[#635bff] mx-auto rounded-full" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { label: 'Uptime', val: '99.99%', sub: 'Last 365 Days' },
                    { label: 'Encryption', val: 'AES-256', sub: 'End-to-End' },
                    { label: 'Isolation', val: 'Level 4', sub: 'Cryptographic' }
                ].map(stat => (
                    <div key={stat.label} className="text-center p-10 rounded-3xl bg-slate-50 border border-slate-100">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</div>
                        <div className="text-4xl font-display font-bold text-slate-900 mb-1">{stat.val}</div>
                        <div className="text-[10px] font-bold text-[#635bff] uppercase tracking-[0.2em]">{stat.sub}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </PublicLayout>
  );
}
