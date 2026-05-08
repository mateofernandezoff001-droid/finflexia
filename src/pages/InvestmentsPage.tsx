import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Search, ArrowRight, Star, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFinance } from "@/src/hooks/useFinance";

const mockInvestments = [
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 175.22, change: 2.5, logo: 'T' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.43, change: -0.8, logo: 'A' },
  { symbol: 'BTC', name: 'Bitcoin', price: 67432.10, change: 5.2, logo: 'B' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 894.33, change: 3.1, logo: 'N' },
  { symbol: 'ETH', name: 'Ethereum', price: 3452.20, change: 1.4, logo: 'E' },
];

export function InvestmentsPage() {
  const { wallet } = useFinance();

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold">Investments</h1>
          <p className="text-muted-foreground">Portfolio simulation with real-time simulated market data.</p>
        </div>
        <div className="w-full md:w-auto relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <Input 
            placeholder="Search stocks, crypto, ETFs..." 
            className="pl-10 h-12 w-full md:w-80 rounded-xl bg-card border-border/50 focus-visible:ring-accent"
          />
        </div>
      </header>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="fin-card bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest text-emerald-600">S&P 500 Simulation</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-mono font-bold">5,243.32</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-700 border-none">+1.4%</Badge>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500/40" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="fin-card bg-rose-500/5 border-rose-500/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest text-rose-600">NASDAQ Simulation</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-mono font-bold">16,423.10</h3>
                  <Badge className="bg-rose-500/20 text-rose-700 border-none">-0.5%</Badge>
                </div>
              </div>
              <TrendingDown className="w-8 h-8 text-rose-500/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="fin-card bg-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest text-accent">Market Sentiment</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-display font-bold italic">Greedy</h3>
                  <Badge className="bg-accent/20 text-accent border-none">Bull Mode</Badge>
                </div>
              </div>
              <Star className="w-8 h-8 text-accent/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Watchlist */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="fin-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Market Watchlist</CardTitle>
                <CardDescription>Real-time tracked assets in your simulation environment.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2 rounded-lg">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockInvestments.map((asset) => (
                  <div key={asset.symbol} className="fin-card p-5 group flex justify-between items-center bg-card hover:bg-accent/5 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center font-bold text-accent group-hover:scale-110 transition-transform">
                        {asset.logo}
                      </div>
                      <div>
                        <h4 className="font-bold flex items-center gap-2">
                          {asset.symbol} <span className="text-xs opacity-40 font-normal">{asset.name}</span>
                        </h4>
                        <p className="text-xl font-mono font-bold">${asset.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className={cn(
                        "flex items-center gap-1 font-bold text-sm",
                        asset.change > 0 ? "text-emerald-500" : "text-rose-500"
                      )}>
                        {asset.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {asset.change}%
                      </div>
                      <Button size="sm" className="h-8 px-4 rounded-lg bg-accent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Trade
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="fin-card border-none bg-gradient-to-tr from-card to-accent/5 p-8 flex items-center justify-between">
             <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold tracking-tight">Need smarter portfolio advice?</h3>
                <p className="text-muted-foreground">Ask our AI for a deep analysis of your current simulation.</p>
                <Button className="mt-4 bg-accent hover:bg-accent/90 text-white rounded-xl gap-2 font-medium">
                  Go to AI Insights <ArrowRight className="w-4 h-4" />
                </Button>
             </div>
             <div className="hidden md:block opacity-20">
               <TrendingUp className="w-32 h-32 text-accent" />
             </div>
          </Card>
        </div>

        {/* Portfolio Mini Dashboard */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="fin-card border-accent/20">
            <CardHeader>
              <CardTitle className="text-xl">My Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest mb-1">Total Equity</p>
                <h2 className="text-4xl font-mono font-bold">$12,430.22</h2>
                <p className="text-emerald-500 font-bold text-sm">+$1,244.30 (12.4%)</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Portfolio Risk</span>
                  <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200">Medium</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Diversification</span>
                  <p className="text-sm font-bold">Good</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Asset Class</span>
                  <p className="text-sm font-bold">80% Equity / 20% Crypto</p>
                </div>
              </div>

              <Button className="w-full bg-accent hover:bg-accent/90 text-white h-12 rounded-xl mt-4">
                Rebalance Portfolio
              </Button>
            </CardContent>
          </Card>

          <Card className="fin-card">
            <CardHeader>
              <CardTitle className="text-lg">Top Gainers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockInvestments.filter(a => a.change > 0).slice(0, 3).map(asset => (
                <div key={asset.symbol} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm">{asset.symbol}</span>
                  </div>
                  <span className="text-emerald-500 font-bold text-sm">+{asset.change}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
