import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi } from "lightweight-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/src/hooks/useAuth";
import { tradingService, Position } from "@/src/services/trading.service";
import { financeService, MarketAsset } from "@/src/services/finance.service";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, History, LayoutGrid, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

import { socketService } from "@/src/lib/socket";

export function TradingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<any>(null);
  
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [market, setMarket] = useState<MarketAsset[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [amount, setAmount] = useState<string>("1.0");
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Initial fetch
    financeService.getMarketData().then(data => {
      setMarket(data);
      if (!selectedAsset && data.length > 0) setSelectedAsset(data[0]);
    });

    // Socket subscription
    const unsubscribe = socketService.subscribe("market_update", (data: MarketAsset[]) => {
      setMarket(data);
      setIsLive(true);
      
      // Update selected asset price if it's in the update
      if (selectedAsset) {
        const updated = data.find(a => a.symbol === selectedAsset.symbol);
        if (updated) {
          setSelectedAsset(prev => prev ? { ...prev, price: updated.price } : updated);
          
          // Update chart if we have one
          if (candleSeriesRef.current) {
            candleSeriesRef.current.update({
              time: Math.floor(Date.now() / 1000) as any,
              value: updated.price
            });
          }
        }
      }
    });

    const checkConnection = setInterval(() => {
        // In the new architecture, we manage connectivity via the Supabase channel status
        // For simplicity in the UI, we'll keep the live status active once subscribed
        setIsLive(true);
    }, 5000);

    return () => {
        unsubscribe();
        clearInterval(checkConnection);
    };
  }, [selectedAsset]);

  useEffect(() => {
    if (user) {
      tradingService.getPositions(user.userId).then(setPositions);
    }
  }, [user]);

  // Chart Logic
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: '#f1f5f9' },
        horzLines: { color: '#f1f5f9' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderVisible: false,
        timeVisible: true,
      },
      rightPriceScale: {
        borderVisible: false,
      },
    });

    const candleSeries = (chart as any).addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    // Mock initial data
    const now = Math.floor(Date.now() / 1000);
    const mockData = Array.from({ length: 60 }).map((_, i) => ({
      time: (now - (60 - i) * 60) as any,
      open: 100 + Math.random() * 20,
      high: 125 + Math.random() * 20,
      low: 90 + Math.random() * 20,
      close: 110 + Math.random() * 20,
    }));
    candleSeries.setData(mockData);

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  const handlePlaceOrder = async () => {
    if (!user || !selectedAsset) return;
    
    await tradingService.placeOrder({
      userId: user.userId,
      symbol: selectedAsset.symbol,
      type: orderType,
      side: 'MARKET',
      quantity: Number(amount),
      price: selectedAsset.price
    });

    // Refresh positions
    tradingService.getPositions(user.userId).then(setPositions);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/30 overflow-hidden">
      {/* Trading Header */}
      <div className="h-16 border-b border-slate-200 bg-white flex items-center px-6 gap-8 shrink-0">
        <div className="flex items-center gap-4">
           {selectedAsset && (
             <>
               <div className="flex flex-col">
                 <span className="text-sm font-bold text-slate-900">{selectedAsset.symbol}/USD</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedAsset.name}</span>
               </div>
               <div className="h-8 w-px bg-slate-100" />
               <div className="flex flex-col">
                 <span className={cn("text-sm font-mono font-bold", selectedAsset.change >= 0 ? "text-emerald-500" : "text-rose-500")}>
                    ${selectedAsset.price.toLocaleString()}
                 </span>
                 <span className="text-[10px] font-bold text-slate-400">MARKET PRICE</span>
               </div>
             </>
           )}
        </div>

        <div className="flex-1 flex justify-center">
            <div className="flex gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                {['1m', '5m', '15m', '1h', '4h', '1d'].map(tf => (
                    <button key={tf} className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-900 rounded transition-colors">
                        {tf.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex items-center gap-4">
           <Badge variant="outline" className={cn("h-8 gap-2 px-3 transition-colors", isLive ? "border-emerald-100 text-emerald-600 bg-emerald-50/50" : "border-slate-200 text-slate-400 bg-slate-50")}>
              <div className={cn("w-2 h-2 rounded-full", isLive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
              {isLive ? 'Live Feed' : 'Connecting...'}
           </Badge>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Market Sidebar */}
        <div className="w-72 border-r border-slate-200 bg-white flex flex-col shrink-0">
           <div className="p-4 border-b border-slate-100">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder={t('common.search')} className="pl-9 h-9 text-xs rounded-lg border-slate-100 bg-slate-50 focus-visible:ring-accent/20" />
             </div>
           </div>
           <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {market.map(asset => (
                  <button 
                    key={asset.symbol} 
                    onClick={() => setSelectedAsset(asset)}
                    className={cn(
                        "w-full px-6 py-4 flex items-center justify-between transition-all hover:bg-slate-50 text-left",
                        selectedAsset?.symbol === asset.symbol ? "bg-accent/5 border-l-2 border-accent" : "border-l-2 border-transparent"
                    )}
                  >
                    <div>
                        <div className="text-xs font-bold text-slate-900">{asset.symbol}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{asset.name}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-mono font-bold text-slate-900">${asset.price.toFixed(2)}</div>
                        <div className={cn("text-[9px] font-bold", asset.change >= 0 ? "text-emerald-500" : "text-rose-500")}>
                            {asset.change > 0 ? '+' : ''}{asset.change}%
                        </div>
                    </div>
                  </button>
              ))}
           </div>
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 p-6 relative">
                 <div ref={chartContainerRef} className="w-full h-full" />
                 
                 {/* Floating Overlay Info */}
                 <div className="absolute top-10 left-10 p-4 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm pointer-events-none z-10">
                     <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Indicators</div>
                     <div className="flex gap-3">
                         <span className="text-[10px] font-bold text-indigo-500">EMA(9): 124.50</span>
                         <span className="text-[10px] font-bold text-amber-500">EMA(21): 120.32</span>
                         <span className="text-[10px] font-bold text-slate-400">Vol: 1.2M</span>
                     </div>
                 </div>
            </div>

            {/* Bottom Drawer (Positions/History) */}
            <div className="h-64 border-t border-slate-200 bg-white">
                <Tabs defaultValue="positions" className="h-full flex flex-col">
                    <div className="px-6 border-b border-slate-100 flex items-center h-12">
                        <TabsList className="bg-transparent h-full gap-6">
                            <TabsTrigger value="positions" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-accent text-[11px] font-bold uppercase tracking-widest h-full rounded-none border-b-2 border-transparent data-[state=active]:border-accent p-0">{t('common.equity')}</TabsTrigger>
                            <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-accent text-[11px] font-bold uppercase tracking-widest h-full rounded-none border-b-2 border-transparent data-[state=active]:border-accent p-0">{t('dashboard.activity_log')}</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="positions" className="flex-1 m-0 overflow-y-auto">
                        <div className="p-0">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-bold uppercase text-slate-400 border-b border-slate-50 sticky top-0 bg-white">
                                    <tr>
                                        <th className="px-6 py-3">Asset</th>
                                        <th className="px-6 py-3">Quantity</th>
                                        <th className="px-6 py-3">Avg Price</th>
                                        <th className="px-6 py-3">Market Price</th>
                                        <th className="px-6 py-3">Unrealized PnL</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {positions.map(p => {
                                        const live = market.find(m => m.symbol === p.symbol);
                                        const pnl = live ? (live.price - p.average_price) * p.quantity : 0;
                                        return (
                                            <tr key={p.id} className="text-xs hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900">{p.symbol}</td>
                                                <td className="px-6 py-4 font-mono">{p.quantity}</td>
                                                <td className="px-6 py-4 font-mono">${p.average_price.toFixed(2)}</td>
                                                <td className="px-6 py-4 font-mono">${live?.price.toFixed(2)}</td>
                                                <td className={cn("px-6 py-4 font-mono font-bold", pnl >= 0 ? "text-emerald-500" : "text-rose-500")}>
                                                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-slate-400 hover:text-rose-600">CLOSE</Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {positions.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-slate-300 font-medium">No open positions</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        {/* Order Panel */}
        <div className="w-80 border-l border-slate-200 bg-white p-6 flex flex-col gap-6 shrink-0">
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Button 
                        onClick={() => setOrderType('BUY')}
                        className={cn(
                            "flex-1 h-10 rounded-lg text-xs font-bold transition-all",
                            orderType === 'BUY' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        )}
                    >
                        {t('common.buy').toUpperCase()}
                    </Button>
                    <Button 
                        onClick={() => setOrderType('SELL')}
                        className={cn(
                            "flex-1 h-10 rounded-lg text-xs font-bold transition-all",
                            orderType === 'SELL' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                        )}
                    >
                        {t('common.sell').toUpperCase()}
                    </Button>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Type</label>
                    <Tabs defaultValue="market" className="w-full">
                        <TabsList className="w-full bg-slate-50 p-1 rounded-lg h-9">
                            <TabsTrigger value="market" className="flex-1 text-[10px] font-bold uppercase h-full rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Market</TabsTrigger>
                            <TabsTrigger value="limit" className="flex-1 text-[10px] font-bold uppercase h-full rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Limit</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity ({selectedAsset?.symbol})</label>
                    <div className="relative">
                        <Input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            className="bg-slate-50 border-slate-100 h-11 pr-12 font-mono font-bold focus-visible:ring-accent/20" 
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">MAX</span>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex justify-between text-[10px] font-medium text-slate-400">
                        <span>Available Balance</span>
                        <span className="text-slate-900 font-bold">$10,245.00</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-slate-400">
                        <span>Est. Cost</span>
                        <span className="text-slate-900 font-bold">${((Number(amount) || 0) * (selectedAsset?.price || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-medium text-slate-400">
                        <span>Est. Fee (0.1%)</span>
                        <span className="text-slate-900 font-bold">${((Number(amount) || 0) * (selectedAsset?.price || 0) * 0.001).toFixed(2)}</span>
                    </div>
                </div>

                <Button 
                    onClick={handlePlaceOrder}
                    className={cn(
                        "w-full h-12 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95",
                        orderType === 'BUY' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/15" : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/15"
                    )}
                >
                    {orderType === 'BUY' ? t('common.buy') : t('common.sell')} {selectedAsset?.symbol}
                </Button>
            </div>

            <div className="mt-auto space-y-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <TrendingUp className="w-3 h-3" /> Trading Metrics
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50">
                      <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Daily ROI</div>
                      <div className="text-emerald-500 text-xs font-bold">+2.45%</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50">
                      <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">Max Drawdown</div>
                      <div className="text-rose-500 text-xs font-bold">-1.12%</div>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
