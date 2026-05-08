import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ArrowRight, Globe, ShieldCheck, Cpu } from "lucide-react";
import { LanguageSelector } from "@/src/components/layout/LanguageSelector";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#635bff] flex items-center justify-center text-white font-bold">F</div>
          <span className="text-xl font-display font-bold tracking-tight">FinFlex Pro</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
          <Link to="/features" className="hover:text-[#635bff] transition-colors uppercase tracking-widest text-[10px]">{t('nav.features')}</Link>
          <Link to="/security" className="hover:text-[#635bff] transition-colors uppercase tracking-widest text-[10px]">{t('nav.security')}</Link>
          <Link to="/developers" className="hover:text-[#635bff] transition-colors uppercase tracking-widest text-[10px]">{t('nav.developers')}</Link>
          <Link to="/company" className="hover:text-[#635bff] transition-colors uppercase tracking-widest text-[10px]">{t('nav.company')}</Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:block">
            <LanguageSelector />
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest h-10 px-4">{t('nav.signin')}</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-[#635bff] hover:bg-[#635bff]/90 text-white font-bold text-xs uppercase tracking-widest h-10 px-6 gap-2 rounded-lg shadow-lg shadow-[#635bff]/20">
                {t('nav.get_started')} <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-16 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1 space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#635bff] flex items-center justify-center text-white font-bold text-xs font-mono">F</div>
                    <span className="font-display font-bold tracking-tight text-lg">FinFlex Intelligence</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                    Professional financial terminal designed for the next generation of asset management and intelligent wealth growth.
                </p>
                <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <ShieldCheck className="w-5 h-5" />
                    <Globe className="w-5 h-5" />
                    <Cpu className="w-5 h-5" />
                </div>
            </div>
            
            {[
                { title: 'Product', links: [t('nav.features'), t('nav.security'), 'Trading', 'Wallets'] },
                { title: 'Resources', links: [t('nav.developers'), 'API Hub', 'Status', 'Help Center'] },
                { title: 'Company', links: [t('nav.company'), 'About', 'Roadmap', 'Blog'] }
            ].map(sect => (
                <div key={sect.title} className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{sect.title}</h4>
                    <ul className="space-y-2">
                        {sect.links.map(l => (
                            <li key={l}><a href="#" className="text-sm font-medium text-slate-600 hover:text-[#635bff] transition-colors">{l}</a></li>
                        ))}
                    </ul>
                </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 FinFlex Professional. SECURE TERMINAL v2.5.1</p>
            <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Compliance</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
