import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  BrainCircuit, 
  Settings, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  CandlestickChart,
  Shield,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";

export function Sidebar() {
  const { signOut, user, isAdmin } = useAuth();
  const { t } = useTranslation();

  const menuItems = [
    { icon: LayoutDashboard, label: t('common.dashboard'), href: "/dashboard" },
    { icon: Wallet, label: t('common.wallet'), href: "/wallet" },
    { icon: TrendingUp, label: t('common.investments'), href: "/investments" },
    { icon: CandlestickChart, label: "Trading", href: "/trading" },
    { icon: BrainCircuit, label: t('common.ai_assistant'), href: "/ai" },
    ...(isAdmin ? [{ icon: Shield, label: "Admin", href: "/admin" }] : []),
  ];

  return (
    <div className="w-64 border-r border-border h-full flex flex-col bg-white">
      <div className="px-6 py-8">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-lg font-display font-bold tracking-tight text-primary">FinFlex</span>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                  isActive 
                    ? "bg-accent/5 text-accent" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-6 py-8 border-t border-border space-y-4">
        <LanguageSelector />
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold border border-border">
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-primary truncate">{user?.displayName || "User"}</span>
            <span className="text-[10px] text-slate-400 truncate">{user?.email}</span>
          </div>
        </div>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-9 px-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs rounded-lg"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
