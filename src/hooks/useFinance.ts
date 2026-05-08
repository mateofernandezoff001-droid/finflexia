import { useState, useEffect } from "react";
import { financeService, Transaction } from "@/src/services/finance.service";
import { useAuth } from "./useAuth";

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
}

export function useFinance() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubWallet = financeService.subscribeToWallet(user.userId, setWallet);
    const unsubTrans = financeService.subscribeToTransactions(user.userId, (data) => {
      setTransactions(data);
      setLoading(false);
    });

    return () => {
      unsubWallet();
      unsubTrans();
    };
  }, [user]);

  const addTransaction = async (data: Partial<Transaction>) => {
    if (!user || !wallet) return;
    await financeService.addTransaction(user.userId, wallet.id, data);
  };

  return { wallet, transactions, loading, addTransaction };
}
