import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFinance } from "@/src/hooks/useFinance";
import { Transaction } from "@/src/services/finance.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function WalletPage() {
  const { t } = useTranslation();
  const { wallet, transactions, addTransaction } = useFinance();
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  const handleTransaction = async (type: 'income' | 'expense') => {
    if (!amount || isNaN(Number(amount))) return;
    
    await addTransaction({
      type,
      amount: Number(amount),
      category: type === 'income' ? 'Deposit' : 'Withdrawal',
      description: desc || (type === 'income' ? 'Manual deposit' : 'Manual withdrawal')
    });
    
    setAmount("");
    setDesc("");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: wallet?.currency || 'USD'
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold">{t('common.wallet')}</h1>
          <p className="text-muted-foreground">{t('dashboard.summary')}</p>
        </div>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger
              render={
                <Button className="bg-accent hover:bg-accent/90 text-white rounded-xl gap-2 h-12 px-6 shadow-lg shadow-accent/20 transition-all active:scale-95">
                  <Plus className="w-5 h-5" /> Add Funds
                </Button>
              }
            />
            <DialogContent className="rounded-2xl sm:max-w-[425px] border-border/50">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold">Add Funds</DialogTitle>
                <p className="text-muted-foreground text-sm">Transfer virtual funds to your main wallet account.</p>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Amount (USD)</label>
                  <Input 
                    placeholder="0.00" 
                    className="h-14 text-2xl font-mono focus-visible:ring-accent"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Description (Optional)</label>
                  <Input 
                    placeholder="e.g. Stock sale" 
                    className="h-12 focus-visible:ring-accent"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  className="w-full h-12 bg-accent text-white rounded-xl"
                  onClick={() => handleTransaction('income')}
                >
                  Confirm Deposit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Card View */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-accent rounded-[2rem] border-none shadow-2xl p-8 text-white h-[260px] flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform">
              <WalletIcon className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-auto">
                <span className="text-lg font-medium opacity-80">Primary Savings</span>
                <span className="font-mono text-sm tracking-widest">{t('common.equity').toUpperCase()}</span>
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-mono tracking-tighter font-bold">{formatCurrency(wallet?.balance || 0)}</p>
                <p className="text-sm opacity-60 uppercase tracking-widest font-mono">**** **** **** 4242</p>
              </div>
            </div>
          </Card>

          <Card className="fin-card">
            <CardHeader>
              <CardTitle className="text-xl">Account Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-4 h-12 rounded-xl text-foreground font-medium border-border/40 hover:bg-muted/30">
                <CreditCard className="w-5 h-5 text-accent" /> Freeze Virtual Card
              </Button>
              <Button variant="outline" className="w-full justify-start gap-4 h-12 rounded-xl text-foreground font-medium border-border/40 hover:bg-muted/30">
                <Settings className="w-5 h-5 text-accent" /> Limits & Security
              </Button>
              <Button variant="outline" className="w-full justify-start gap-4 h-12 rounded-xl text-foreground font-medium border-border/40 hover:bg-muted/30">
                <MoreHorizontal className="w-5 h-5 text-accent" /> Reveal Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History Detail */}
        <Card className="lg:col-span-2 fin-card pb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>History</CardTitle>
              <CardDescription>Statement for your simulated wallet transactions.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-muted px-4 py-1.5 rounded-lg border-none">Last 30 Days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {transactions.map((tx, idx) => (
                <div key={tx.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                      tx.type === 'income' ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                    )}>
                      {tx.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-tight">{tx.description}</p>
                      <p className="text-sm text-muted-foreground font-mono">{tx.type.toUpperCase()} • {tx.id.substring(0, 8)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-xl font-display font-bold font-mono",
                      tx.type === 'income' ? "text-emerald-500" : "text-foreground"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{tx.timestamp ? new Date(tx.timestamp.seconds * 1000).toLocaleDateString() : 'Processing'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Settings(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
