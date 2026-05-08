import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  increment,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { handleFirestoreError, OperationType } from "@/src/lib/firestore-errors";

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'investment';
  amount: number;
  category: string;
  description: string;
  timestamp: any;
  userId: string;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export class FinanceService {
  private static instance: FinanceService;

  static getInstance() {
    if (!FinanceService.instance) {
      FinanceService.instance = new FinanceService();
    }
    return FinanceService.instance;
  }

  // Market data simulation for one-click Netlify deployment compatibility
  // Use a local mock if Supabase table isn't provisioned yet
  async getMarketData(): Promise<MarketAsset[]> {
    return [
      { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 65000 + Math.random() * 100, change: 1.2 },
      { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3400 + Math.random() * 10, change: -0.5 },
      { id: '3', symbol: 'AAPL', name: 'Apple Inc.', price: 185 + Math.random() * 2, change: 0.8 }
    ];
  }

  subscribeToWallet(userId: string, callback: (wallet: any) => void) {
    // Use a named document "main" to ensure singleton wallet per user
    const walletRef = doc(db, "users", userId, "wallets", "main");
    return onSnapshot(walletRef, (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() });
      } else {
        // Auto-provision wallet
        setDoc(walletRef, {
          userId,
          balance: 10000,
          currency: "USD",
          updatedAt: serverTimestamp()
        }).catch(err => {
          console.error("Wallet provisioning error:", err);
          handleFirestoreError(err, OperationType.WRITE, `users/${userId}/wallets/main`);
        });
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${userId}/wallets/main`);
    });
  }

  subscribeToTransactions(userId: string, callback: (transactions: Transaction[]) => void) {
    const transRef = collection(db, "users", userId, "transactions");
    const q = query(transRef, orderBy("timestamp", "desc"), limit(20));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${userId}/transactions`);
    });
  }

  async addTransaction(userId: string, walletId: string, data: Partial<Transaction>) {
    const transRef = collection(db, "users", userId, "transactions");
    const walletRef = doc(db, "users", userId, "wallets", walletId);

    try {
      await addDoc(transRef, {
        ...data,
        userId,
        timestamp: serverTimestamp()
      });

      const balanceChange = data.type === 'income' ? (data.amount || 0) : -(data.amount || 0);
      await updateDoc(walletRef, {
        balance: increment(balanceChange),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Transaction Error:", err);
      handleFirestoreError(err, OperationType.WRITE, `users/${userId}/transactions`);
    }
  }
}

export const financeService = FinanceService.getInstance();
