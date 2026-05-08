import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Terminal, Code2, Globe, Cpu, BookOpen, Layers, Braces, Workflow } from "lucide-react";
import { PublicLayout } from "@/src/components/layout/PublicLayout";

export function DevelopersPage() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-8">
                <Terminal className="w-3 h-3 text-emerald-400" /> API v2.5.0 STABLE
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
              {t('dev_page.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('dev_page.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                    {[
                        { icon: BookOpen, title: t('dev_page.doc'), desc: t('dev_page.doc_desc') },
                        { icon: Globe, title: t('dev_page.ws'), desc: t('dev_page.ws_desc') },
                        { icon: Braces, title: "SDK Libraries", desc: "Native bindings for React, Node.js, and Swift environments." },
                        { icon: Workflow, title: "Webhooks", desc: "Outbound alerts for trades and security events." }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-10 h-10 rounded-lg bg-[#635bff]/5 text-[#635bff] flex items-center justify-center mb-4">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold mb-2">{item.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-6">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Code2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">OpenAPI Specification</h4>
                        <p className="text-xs text-slate-500">Download our full Swagger definition for automated client generation.</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl relative">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#635bff]/20 blur-3xl opacity-50" />
                <div className="bg-[#1a1b1e] rounded-[2.2rem] overflow-hidden border border-white/5">
                    <div className="flex items-center gap-1.5 px-6 py-4 bg-white/5 border-b border-white/5">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="ml-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">GET /api/finance/wallet</span>
                    </div>
                    <div className="p-8 font-mono text-sm leading-relaxed text-slate-300">
                        <div className="flex gap-4">
                            <span className="text-slate-600">01</span>
                            <span className="text-emerald-400">const</span> <span className="text-blue-400 text-bold font-bold">fetchWallet</span> = <span className="text-emerald-400">async</span> () ={">"} {"{"}
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600">02</span>
                            <span className="ml-4">
                                <span className="text-emerald-400">const</span> res = <span className="text-emerald-400">await</span> <span className="text-amber-400">fetch</span>(
                                    <span className="text-orange-300">'/api/finance/wallet'</span>, 
                                    {"{"}
                                </span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600">03</span>
                            <span className="ml-8 text-slate-500 italic"> // Secure JWT header is auto-injected by SDK</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600">04</span>
                            <span className="ml-8">headers: {"{"} <span className="text-orange-300">'x-api-version'</span>: <span className="text-orange-300">'2.5'</span> {"}"}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600">05</span>
                            <span className="ml-4">{"});"}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600">06</span>
                            <span className="ml-4"><span className="text-emerald-400">return</span> <span className="text-emerald-400">await</span> res.json();</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-slate-600">07</span>
                            <span>{"}"};</span>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
                             <div className="text-emerald-500/50 uppercase text-[10px] tracking-widest font-bold">Response Object</div>
                             <div className="text-slate-500">{"{"}</div>
                             <div className="ml-4 text-slate-400"><span className="text-blue-300">"status"</span>: <span className="text-orange-300">"SUCCESS"</span>,</div>
                             <div className="ml-4 text-slate-400"><span className="text-blue-300">"payload"</span>: {"{"}</div>
                             <div className="ml-8 text-slate-400"><span className="text-blue-300">"balance"</span>: <span className="text-rose-300">4520.42</span>,</div>
                             <div className="ml-8 text-slate-400"><span className="text-blue-300">"currency"</span>: <span className="text-orange-300">"USD"</span></div>
                             <div className="ml-4 text-slate-400">{"}"}</div>
                             <div className="text-slate-500">{"}"}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </PublicLayout>
  );
}
