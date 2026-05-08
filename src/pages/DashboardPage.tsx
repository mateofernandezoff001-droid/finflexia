import { useMemo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Plus, Send, Wallet, TrendingUp, ArrowRight, Activity, Sparkles } from "lucide-react";

import { financeService, MarketAsset } from "@/src/services/finance.service";
import { aiService } from "@/src/services/ai.service";
import { useAuth } from "@/src/hooks/useAuth";
import { useFinance } from "@/src/hooks/useFinance";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { socketService } from "@/src/lib/socket";

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { wallet, transactions } = useFinance();
  const [market, setMarket] = useState<MarketAsset[]>([]);
  const [smartInsight, setSmartInsight] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    financeService.getMarketData().then(setMarket).catch(console.error);

    // Socket subscription
    const unsubscribe = socketService.subscribe("market_update", (data: MarketAsset[]) => {
      setMarket(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (wallet && transactions.length > 0 && !smartInsight) {
        // Debounce or only call once to avoid excessive AI costs
        aiService.analyzeSpending(wallet, transactions).then(setSmartInsight);
    }
  }, [wallet, transactions, smartInsight]);

  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet?.currency || 'USD',
    });
    return (val: number) => formatter.format(val);
  }, [wallet?.currency]);

  const chartData = useMemo(() => {
    return transactions?.slice(0, 10).reverse().map(t => ({
      name: format(t.timestamp?.toDate() || new Date(), 'MMM dd'),
      amount: t.amount,
    })) || [];
  }, [transactions]);

  const monthlySpending = useMemo(() => {
    return transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">{t('dashboard.greeting')}, {user?.displayName?.split(' ')[0]}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('dashboard.summary')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 px-6 rounded-lg text-sm font-medium border-slate-200">
            <Send className="w-4 h-4 mr-2" /> {t('common.dashboard')}
          </Button>
          <Button className="h-11 px-6 bg-accent text-white hover:bg-accent/90 rounded-lg text-sm font-medium shadow-lg shadow-accent/15">
            <Plus className="w-4 h-4 mr-2" /> {t('common.balance')}
          </Button>
        </div>
      </header>

      {smartInsight && (
        <Card className="border-none bg-accent/5 overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-700">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                </div>
                <div className="flex-1 text-xs font-medium text-slate-600 leading-relaxed italic">
                    "{smartInsight.split('\n')[0].replace(/[*#]/g, '').substring(0, 200)}"
                </div>
                <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-accent" onClick={() => window.location.href='/ai'}>
                    Consultar IA
                </Button>
            </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white overflow-hidden group">
          <CardContent className="p-8 relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Wallet className="w-24 h-24 text-primary" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{t('common.balance')}</p>
            <div className="text-4xl font-display font-bold text-primary tabular-nums">
              {formatCurrency(wallet?.balance || 0)}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="flex items-center text-emerald-500 font-bold text-xs">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 2.4%
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Monthly Spending</p>
            <div className="text-4xl font-display font-bold text-primary tabular-nums">
              {formatCurrency(monthlySpending)}
            </div>
            <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-2/3 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary text-white">
          <CardContent className="p-8 flex flex-col justify-between h-full min-h-[160px]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-2">Active Investments</p>
              <div className="text-4xl font-display font-bold tabular-nums">
                {formatCurrency(5420.50)}
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center text-xs font-medium text-emerald-300">
                <Activity className="w-3 h-3 mr-1 whitespace-nowrap" /> +12.5% Profit
              </div>
              <ArrowRight className="w-4 h-4 opacity-50 hover:opacity-100 cursor-pointer" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Financial Flux</CardTitle>
              <CardDescription className="text-xs">Cashflow activity trends</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-slate-50 text-slate-400 border-none text-[10px]">7D</Badge>
              <Badge variant="outline" className="text-slate-300 border-slate-100 text-[10px]">30D</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635bff" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#635bff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#cbd5e1'}} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}} 
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#635bff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market Sidebar */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-lg font-bold">{t('dashboard.market_pulse')}</CardTitle>
            <CardDescription className="text-xs">Global asset simulation</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {market.slice(0, 5).map((asset) => (
                <div key={asset.symbol} className="px-8 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-[10px] text-slate-400 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                      {asset.symbol}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary leading-none">{asset.symbol}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-1 uppercase truncate max-w-[80px]">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-primary tabular-nums">${asset.price.toLocaleString()}</div>
                    <div className={cn(
                      "text-[10px] font-bold mt-1",
                      asset.change >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {asset.change >= 0 ? '+' : ''}{asset.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8">
              <Button variant="outline" className="w-full text-xs font-bold gap-2 rounded-lg border-slate-100 hover:bg-slate-50 group" onClick={() => window.location.href='/investments'}>
                Trade Assets <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent History Table Style */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold">Activity Log</h2>
          <Button variant="ghost" className="text-xs text-accent font-bold hover:bg-accent/5">Download Statement</Button>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-50">
          <div className="divide-y divide-slate-50">
            {transactions.length === 0 ? (
                <div className="p-20 text-center text-slate-300 font-medium">No activity recorded yet</div>
            ) : (
                transactions.slice(0, 6).map((t) => (
                <div key={t.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-5">
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            t.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
                        )}>
                            {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-primary">{t.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.category}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {t.timestamp?.toDate() ? format(t.timestamp.toDate(), 'p') : 'Just now'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={cn(
                            "text-sm font-mono font-bold tabular-nums",
                            t.type === 'income' ? "text-emerald-600" : "text-primary"
                        )}>
                            {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                        </div>
                        <Badge variant="outline" className={cn(
                            "text-[8px] py-0 px-1 border-none font-bold tracking-widest uppercase mt-1",
                            t.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                        )}>
                            {t.type === 'income' ? 'Success' : 'Processed'}
                        </Badge>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
